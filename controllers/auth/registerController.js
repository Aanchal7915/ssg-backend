import { hashPassword, comparePassword } from "../../helper/authHelper.js";
import userModel from "../../models/userModel.js";
import Otp from "../../models/otpModel.js";

//POST REGISTER
export const registerController = async (req, res) => {
    try {
        const { name, email, phone, password, address="NA", isSeller, otp } = req.body;

        //setup validations
        if (!name) res.send({ message: "Name is Required" });
        if (!email) res.send({ message: "Email is Required" });
        if (!password) res.send({ message: "Password is Required" });
        if (!phone) res.send({ message: "Phone No. is Required" });
        if (!otp) res.send({ message: "Otp is Required" });

        //check for existing users
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Email already registered!",
                errorType: "emailConflict",
            });
        }

        const record = await Otp.findOne({ email, otp });
        if (!record) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // OTP verified → delete it
        await Otp.deleteOne({ email });

        //Register User
        const hashedPassword = await hashPassword(password);

        const user = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            role: isSeller ? 1 : 0,
        });
        await user.save();

        res.status(201).send({
            success: true,
            message: "User Registered Successfully!",
            user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error,
        });
    }
};
