import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            default: 0,
        },
        pan: {
            number: {
                type: String,
            },
            name: {
                type: String,
            },
        },
        ratigAndReviews: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "RatingAndReview",
            },
        ],
        wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
        cart: [
            {
                product: { type: mongoose.Schema.ObjectId, ref: "Product" },
                quantity: { type: Number, default: 1 },
                seller: { type: mongoose.Schema.ObjectId, ref: "User" },
                addedAt: { type: Date, default: Date.now }
            },
        ],
        savedForLater: [
            {
                product: { type: mongoose.Schema.ObjectId, ref: "Product" },
                seller: { type: mongoose.Schema.ObjectId, ref: "User" },
                quantity: { type: Number, default: 1 },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        isActive:{  
            type:Boolean,
            default:true
        }


    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
