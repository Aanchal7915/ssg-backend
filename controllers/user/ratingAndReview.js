import mongoose from "mongoose";
import RatingAndReview from "../../models/ratingAndReviewModel.js";
import Product from "../../models/productModel.js";
import User from "../../models/userModel.js";
import Orders from "../../models/orderModel.js";

// Add a review
const addReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;

        if (!productId || !rating || !comment) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).send({
                success: false,
                message: "All fields are required",
            });
        }

        // // Ensure user has bought the product before reviewing
        // const hasBought = await Orders.findOne({
        //     buyer: userId,
        //     "products.productId": productId,
        // });

        // if (!hasBought) {
        //     await session.abortTransaction();
        //     session.endSession();
        //     return res.status(403).send({
        //         success: false,
        //         message: "You can only review products you have purchased",
        //     });
        // }

        // Check if user already reviewed this product
        let review = await RatingAndReview.findOne({ product: productId, user: userId });

        if (review) {
            // Update existing review
            review.rating = rating;
            review.comment = comment;
            await review.save({ session });
        } else {
            // Create new review
            review = await RatingAndReview.create(
                [
                    {
                        product: productId,
                        user: userId,
                        rating,
                        comment,
                    },
                ],
                { session }
            );

            review = review[0]; // since create with array+session returns array

            // Add review reference to Product and User
            await Product.findByIdAndUpdate(
                productId,
                { $push: { ratigAndReviews: review._id } },
                { session }
            );

            await User.findByIdAndUpdate(
                userId,
                { $push: { ratigAndReviews: review._id } },
                { session }
            );
        }

        // ✅ Recalculate product average rating and review count
        const reviews = await RatingAndReview.find({ product: productId }).session(session);
        const ratingsCount = reviews.length;
        const averageRating = reviews.reduce((acc, item) => acc + item.rating, 0) / ratingsCount;

        await Product.findByIdAndUpdate(
            productId,
            { ratings: averageRating, numOfReviews: ratingsCount },
            { session }
        );

        // ✅ Commit transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).send({
            success: true,
            message: review ? "Review added/updated successfully" : "Review updated successfully",
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error adding review:", error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};





export { addReview };

