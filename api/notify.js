import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Если запрос пришел от вебхука Supabase, данные лежат в req.body.record
  const payload = req.body.type === 'INSERT' && req.body.record 
    ? req.body.record 
    : req.body;

  const { name, phone, status } = payload;
  let emailSuccess = false;
  let telegramSuccess = false;

  // 1. Отправка в Telegram
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (botToken && chatId) {
    try {
      const text = `🚨 *Новый клиент в CRM!*\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n🏷️ Статус: ${status}`;
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
      });
      if (response.ok) {
        telegramSuccess = true;
      } else {
        console.error("Telegram API error:", await response.text());
      }
    } catch (err) {
      console.error("Telegram request failed:", err);
    }
  }

  // 2. Отправка на Email
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || "korneicx@gmail.com";
  const smtpTo = process.env.SMTP_TO || "tedwy@mail.ru";

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: true,
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
      console.error("Email error:", err);
      return res.status(500).json({ error: 'Email sending failed' });
    }
  }

  return res.status(200).json({ success: true, emailSuccess });
}
