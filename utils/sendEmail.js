const nodemailer = require("nodemailer");

console.log(
  "SMTP_USER:", process.env.SMTP_USER,
  "SMTP_PASS exists:", !!process.env.SMTP_PASS
);

const sendEmail = async (to, subject, content, isHtml = false) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      ...(isHtml ? { html: content } : { text: content }),
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
