import UserModel from "../../models/userModel.js";

const updateAgent=async (req, res) => {
    try {
        const { agentId } = req.params;
        const { name, email, phone, address, isActive } = req.body;
        // Check if the delivery agent exists
        const existingAgent = await UserModel.findById(agentId);
        if (!existingAgent || existingAgent.role !== 2) {
            return res.status(404).json({ message: "Delivery Agent not found" });
        }
        // Update the delivery agent details
        existingAgent.name = name || existingAgent.name;
        existingAgent.email = email || existingAgent.email;
        existingAgent.phone = phone || existingAgent.phone;
        existingAgent.address = address || existingAgent.address;
        existingAgent.isActive = isActive !== undefined ? isActive : existingAgent.isActive;
        await existingAgent.save();
        res.status(200).json({ message: "Delivery Agent updated successfully", agent: existingAgent });
    } catch (error) {
        console.error("Error updating delivery agent:", error);
        res.status(500).json({ message: "Server error" });
    }

};
export default updateAgent;