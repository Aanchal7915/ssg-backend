import userModel from "../../models/userModel.js";

const getCartAndSaveLater = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
            .populate({
                path: "cart.product",
                populate: { path: "brand seller", select: "name" }, // brand.name, seller.name
            })
            .populate({
                path: "savedForLater.product",
                populate: { path: "brand seller", select: "name" },
            });

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        const cartItems = user.cart.map((item) => ({
            productId: item.product?._id,
            name: item.product?.name,
            stock: item.product?.stock,
            image: item.product?.images?.[0]?.url,
            brandName: item.product?.brand?.name,
            price: item.product?.price,
            discountPrice: item.product?.discountPrice,
            seller: item.product?.seller, // already populated with name/id
            quantity: item.quantity||1,      // cart only
        }));

        const savedForLaterItems = user.savedForLater.map((item) => ({
            productId: item.product?._id,
            name: item.product?.name,
            stock: item.product?.stock,
            image: item.product?.images?.[0]?.url,
            brandName: item.product?.brand?.name,
            price: item.product?.price,
            discountPrice: item.product?.discountPrice,
            seller: item.product?.seller,
            quantity: item.quantity||1,      // save for later only
        }));

        res.status(200).send({
            success: true,
            cart: cartItems,
            savedForLater: savedForLaterItems,
        });

    } catch (error) {
        console.error("Error fetching cart and save later:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching cart and save later",
            error,
        });
    }
};

export default getCartAndSaveLater;