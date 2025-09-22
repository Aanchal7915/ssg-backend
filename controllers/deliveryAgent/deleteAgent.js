
import UserModel from "../../models/userModel.js";

const deleteAgent=async(req,res)=>{
    try {
        const { agentId } = req.params;
        // Check if the delivery agent exists
        const existingAgent = await UserModel.findById(agentId);
        if (!existingAgent || existingAgent.role !== 2) {
            return res.status(404).json({ message: "Delivery Agent not found" });
        }
        // Delete the delivery agent
        await
        UserModel.findByIdAndDelete(agentId);
        res.status(200).json({ message: "Delivery Agent deleted successfully" });
    } catch (error) {
        console.error("Error deleting delivery agent:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export default deleteAgent;
