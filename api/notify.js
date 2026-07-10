import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Разрешаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, status } = req.body;
  let emailSuccess = false;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || "info@kornai.ru";

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
        to: "tedwy@mail.ru",
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
