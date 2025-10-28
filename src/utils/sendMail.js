import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

const isSecure = Number(process.env.SMTP_PORT) === 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: isSecure, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
const DEFAULT_FROM_EMAIL = 'jana.afonina@gmail.com'; 
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
     
      from: process.env.SMTP_FROM || DEFAULT_FROM_EMAIL, 
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
    return info; 

  } catch (error) {
    console.error('Nodemailer Error:', error);
    
    throw createHttpError(500, `Failed to send the email: ${error.message}. Please try again later.`);
  }
};