import Otp from "../../models/otpModel.js";
import sendMail from "../../utils/sendMail.js";
import otpMailTemplate from '../../mailTemplate/otpTemplate.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOtp();

    // Save OTP in DB (old OTP for same email gets replaced)
    await Otp.findOneAndDelete({ email });
    await Otp.create({ email, otp });

    // Send OTP mail
    const template=otpMailTemplate(otp);
    await sendMail({
      from: `"SSG" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your SSG OTP Code",
      html: template
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

export default sendOtp;
