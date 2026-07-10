import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for sending notifications
  app.post("/api/notify", async (req, res) => {
    const { name, phone, status } = req.body;
    
    let telegramSuccess = false;
    let emailSuccess = false;

    // 1. Send to Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (botToken && chatId) {
      try {
        const text = `Новый клиент в CRM!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n🏷️ Статус: ${status}`;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text })
        });
        if (response.ok) {
          telegramSuccess = true;
        } else {
          console.error("Telegram API error:", await response.text());
        }
      } catch (err) {
        console.error("Telegram request failed:", err);
      }
    } else {
      console.warn("Telegram credentials not configured in environment variables.");
    }

    // 2. Send to Email
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || "korneicx@gmail.com";
    const smtpTo = process.env.SMTP_TO || "info@dostupnoepravo.ru";

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: true, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"KORNAI CRM" <${smtpFrom}>`,
          to: smtpTo,
          subject: "Новый клиент в CRM",
          text: `Имя: ${name}\nТелефон: ${phone}\nСтатус: ${status}`,
          html: `<p><strong>Имя:</strong> ${name}</p><p><strong>Телефон:</strong> ${phone}</p><p><strong>Статус:</strong> ${status}</p>`,
        });
        emailSuccess = true;
      } catch (err) {
        console.error("Email send failed:", err);
      }
    } else {
      console.warn("SMTP credentials not configured in environment variables.");
    }

    res.json({ success: true, telegramSuccess, emailSuccess });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
