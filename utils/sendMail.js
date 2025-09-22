import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host:  process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async ({to, subject,  html, attachments:[]}) => {
  const mailOptions = {
    from: `"SSG" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html 
  };

  await transporter.sendMail(mailOptions);
};


export default sendOtpEmail;