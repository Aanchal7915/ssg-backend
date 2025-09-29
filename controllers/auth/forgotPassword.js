import { hashPassword, comparePassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";
import Otp from "../../models/otpModel.js";

// POST Forgot Password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        //Checking the EMAIL and PASSWORD
        if (!email || !password || !otp) {
            return res.status(401).send({
                success: false,
                message: "Invalid username or password or otp",
                errorType: "invalidCredentials",
            });
        }

        const existingOtp = await Otp.findOne({ email, otp });
        if (!existingOtp) {
            return res.status(400).send({
                success: false,

                message: "Invalid or expired OTP",
                errorType: "invalidOtp",
            });
        }
        
        await Otp.deleteOne({ email });


        //FINDING THE USER
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User Not Registered!",
                errorType: "invalidUser",
            });
        }
        const newPassword = await hashPassword(password);

        //IF USER EXISTS-
        const response = await userModel.findOneAndUpdate(
            { email: email },
            {
                password: newPassword,
            }
        );

        //SUCCESS RESPONSE
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully!",
            response,
        });
    } catch (error) {
        console.log("Forgot Password Error: " + error);
        res.status(500).send({
            success: false,
            message: "Forgot Password - Server issue!",
            error,
        });
    }
};
