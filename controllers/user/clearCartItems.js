import userModel from "../../models/userModel.js";

const clearCartItem=async(req, res)=>{
    try {
        const userId=req.user._id;
        await userModel.findOneAndUpdate({_id:userId},{$set:{cartItems:[]}});
        return res.status(200).json({message:"Cart cleared successfully"});
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({message:"Failed to clear cart"});
    }

}

export default clearCartItem;