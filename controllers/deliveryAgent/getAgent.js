import UserModel from "../../models/userModel.js";

const getAgent=async(req,res)=>{
    try {
        
        const existingAgent = await UserModel.find({role:2});
        
        res.status(200).json({ agents: existingAgent });
    } catch (error) {
        console.error("Error fetching delivery agent:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAgentById=async(req,res)=>{
    try {
        const { agentId } = req.params;
        // Check if the delivery agent exists
        const existingAgent = await UserModel.findById(agentId);
        if (!existingAgent || existingAgent.role !== 2) {
            return res.status(404).json({ message: "Delivery Agent not found" });
        }
        res.status(200).json({ agent: existingAgent });
    } catch (error) {
        console.error("Error fetching delivery agent:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export {getAgentById, getAgent};