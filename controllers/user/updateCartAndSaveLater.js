import userModel from "../../models/userModel.js";

const updateCartAndSaveLater = async (req, res) => {
    try {
        const { product: productId, type, quantity=1, list, seller } = req.body;

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        if (list === "cart") {
            if (type === "add") {
                if (user.cart?.length >= 5) {
                    return res.status(400).send({ success: false, message: "Cart limit reached" });
                }
                const existingIndex = user.cart.findIndex(
                    item => item.product.toString() === productId
                );
                if (existingIndex !== -1) {
                    user.cart[existingIndex].quantity = quantity || 1;
                } else {
                    user.cart.push({ product: productId, quantity: quantity || 1, seller });
                }
                user.savedForLater = user.savedForLater.filter(
                    item => item.product.toString() !== productId
                );

            } else if (type === "remove") {
                user.cart = user.cart.filter(
                    item => item.product.toString() !== productId
                );
            }

        } else if (list === "savedForLater") {
            if (type === "add") {
                if (user.savedForLater?.length >= 3) {
                    return res.status(400).send({ success: false, message: "Save for Later limit reached" });
                }
                user.cart = user.cart.filter(item => item.product.toString() !== productId);

                const exists = user.savedForLater.find(
                    item => item.product.toString() === productId
                );
                if (!exists) user.savedForLater.push({ product: productId, quantity, seller });

            } else if (type === "remove") {
                user.savedForLater = user.savedForLater.filter(
                    item => item.product.toString() !== productId
                );

            } else if (type === "moveToCart") {
                const savedItem = user.savedForLater.find(
                    item => item.product.toString() === productId
                );
                if (savedItem) {
                    user.cart.push({ product: productId, quantity: savedItem.quantity, seller: savedItem.seller });
                    user.savedForLater = user.savedForLater.filter(
                        item => item.product.toString() !== productId
                    );
                }
            }
        }

        await user.save();

        // 🔑 Re-fetch with population for consistent response
        const populatedUser = await userModel.findById(req.user._id)
            .populate({
                path: "cart.product",
                populate: { path: "brand seller", select: "name" },
            })
            .populate({
                path: "savedForLater.product",
                populate: { path: "brand seller", select: "name" },
            });

        const cartItems = populatedUser.cart.map((item) => ({
            productId: item.product?._id,
            name: item.product?.name,
            stock: item.product?.stock,
            image: item.product?.images?.[0]?.url,
            brandName: item.product?.brand?.name,
            price: item.product?.price,
            discountPrice: item.product?.discountPrice,
            seller: item.product?.seller,
            quantity: item.quantity||1,
        }));

        const savedForLaterItems = populatedUser.savedForLater.map((item) => ({
            productId: item.product?._id,
            name: item.product?.name,
            stock: item.product?.stock,
            image: item.product?.images?.[0]?.url,
            brandName: item.product?.brand?.name,
            price: item.product?.price,
            discountPrice: item.product?.discountPrice,
            seller: item.product?.seller,
            quantity: item.quantity||1,
        }));

        res.status(201).send({
            success: true,
            cart: cartItems,
            savedForLater: savedForLaterItems,
        });

    } catch (error) {
        console.log("Error in Updating Cart Products: " + error);
        res.status(500).send({
            success: false,
            message: "Error in updating cart products",
            error,
        });
    }
};

export default updateCartAndSaveLater;
