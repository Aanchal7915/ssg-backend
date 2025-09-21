import mongoose from "mongoose";

const ratingAndReviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Prevent same user reviewing the same product twice
ratingAndReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.model("RatingAndReview", ratingAndReviewSchema);
