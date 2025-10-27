
import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // Brevo на порту 587 використовує STARTTLS, тому false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Функція для надсилання електронних листів.
 * @param {object} options - Об'єкт з параметрами листа (to, subject, html, attachments)
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM, 
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);

  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};