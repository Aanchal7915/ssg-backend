import nodemailer from "nodemailer";
import sgMail from '@sendgrid/mail';

import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log("host:" + process.env.EMAIL_HOST + " user:" + process.env.EMAIL_USER + " pass:", process.env.EMAIL_PASS);


const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  if (process.env.MAIL_SERVICE == 2) {

    const mailOptions = {
      from: `"SSG" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments
    };

    await transporter.sendMail(mailOptions);
  } else {
    const msg = {
      to,
      from: process.env.EMAIL_USER, // your SendGrid verified sender email
      subject,
      text: "text",
      html,
      attachments
    };
    await sgMail.send(msg);
  }
};


export default sendEmail;