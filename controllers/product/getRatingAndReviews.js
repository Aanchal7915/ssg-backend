import mongoose from "mongoose";
import RatingAndReview from "../../models/ratingAndReviewModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";
import Orders from "../../models/orderModel.js";

// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await RatingAndReview.find({ product: productId }).populate("user", "name email");

        res.status(200).send({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send({
            success: false,
            message: "Failed to fetch reviews",
            error,
        });
    }
};