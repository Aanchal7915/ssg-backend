import {hashPassword} from "../../helper/authHelper.js";
import UserModel from "../../models/userModel.js";

const addAgent=async(req,res)=>{
    try {
        const { name, email, password="12345", phone, address="NA" } = req.body;
        // Check if the delivery agent already exists
        const existingAgent = await UserModel.findOne({ email});
        if (existingAgent) {
            return res.status(400).json({ message: "Delivery Agent already exists" });
        }

        const pass=await hashPassword(password);
        // Create a new delivery agent
        const newAgent = new UserModel({
            name,
            email,
            password:pass,
            phone,
            address,
            role: 2, // Role 2 for delivery agents
        });
        await newAgent.save();

        res.status(201).json({ message: "Delivery Agent added successfully", agent: newAgent });
    }
    catch (error) {
        console.error("Error adding delivery agent:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default addAgent;