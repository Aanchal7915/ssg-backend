import userModel from "../../models/userModel.js";

const updateWishlist = async (req, res) => {
    try {
        const { productId, type } = req.body;

        let response;
        if (type === "add") {
            response = await userModel.findByIdAndUpdate(
                req.user._id,
                { $addToSet: { wishlist: productId } }, // prevents duplicates
                { new: true }
            );
        } else if (type === "remove") {
            response = await userModel.findByIdAndUpdate(
                req.user._id,
                { $pull: { wishlist: productId } },
                { new: true }
            );
        }

        const wishlistItems = response.wishlist;
        res.status(201).send({
            success: true,
            wishlistItems,
        });
    } catch (error) {
        console.log("Error in Updating Wishlist Products: " + error);
        res.status(500).send({
            success: false,
            message: "Error in Updating Wishlist Products",
            error,
        });
    }
};

export default updateWishlist;
