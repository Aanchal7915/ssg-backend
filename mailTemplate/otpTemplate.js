const otpMailTemplate = (OTP_CODE) => {
    const YEAR=2025//new Date()
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SSg OTP Verification</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
    body {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
        background-color: #121212;
        color: #f0f0f0;
    }
    .container {
        max-width: 600px;
        margin: 40px auto;
        background: linear-gradient(135deg, #1f1f1f, #2c2c2c);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
    .header {
        background-color: #1a73e8;
        text-align: center;
        padding: 20px;
    }
    .header img {
        max-width: 120px;
    }
    .content {
        padding: 30px 25px;
        text-align: center;
    }
    .content h1 {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 15px;
        color: #ffffff;
    }
    .content p {
        font-size: 16px;
        color: #cccccc;
        margin-bottom: 25px;
    }
    .otp {
        display: inline-block;
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(90deg, #ff7e5f, #feb47b);
        padding: 15px 25px;
        border-radius: 10px;
        letter-spacing: 6px;
        margin-bottom: 25px;
        color: #fff;
    }
    .footer {
        text-align: center;
        font-size: 12px;
        color: #777;
        padding: 15px 20px;
        background-color: #1c1c1c;
    }
    .footer a {
        color: #1a73e8;
        text-decoration: none;
    }
    @media (max-width: 600px) {
        .otp {
            font-size: 24px;
            padding: 12px 20px;
        }
    }
</style>
</head>
<body>
<div class="container">
    <div class="header">
        <img src="https://res.cloudinary.com/dn0j5mkmb/image/upload/v1758556226/logo-10_begizj.png" alt="SSG Logo">
    </div>
    <div class="content">
        <h1>One-Time Password (OTP) Verification</h1>
        <p>Hi there,</p>
        <p>Use the following OTP to complete your login or transaction on <strong>SSg</strong>. This OTP is valid for 10 minutes.</p>
        <div class="otp">${OTP_CODE}</div>
        <p>If you did not request this, please ignore this email.</p>
        <p>Thank you for choosing <strong>SSG</strong>!</p>
    </div>
    <div class="footer">
        &copy; ${YEAR} SSG. All rights reserved. <br>
        Visit our website: <a href="ssg-frontend-one.vercel.app">ssg-frontend-one.vercel.app</a>
    </div>
</div>
</body>
</html>
`
}

export default otpMailTemplate;