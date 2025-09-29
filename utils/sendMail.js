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

const sendOtpEmail = async ({to, subject,  html, attachments=[]}) => {
  console.log("from",to, subject, html);


  const mailOptions = {
    from: `"SSG" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html ,
    attachments
  };

  await transporter.sendMail(mailOptions);
};


export default sendOtpEmail;