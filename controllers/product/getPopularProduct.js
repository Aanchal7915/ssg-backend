// controllers/productController.js

import Order from "../../models/orderModel.js";
import Product from "../../models/productModel.js";
import mongoose from "mongoose";

export const getPopularProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Step 1: Aggregate sold product counts from Orders
        const soldCounts = await Order.aggregate([
            { $unwind: "$products" },
            {
                $group: {
                    _id: "$products.productId",
                    totalSold: { $sum: "$products.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: limit },
        ]);

        const productIds = soldCounts.map((item) =>
            new mongoose.Types.ObjectId(item._id)
        );

        // Step 2: Get full product details for these IDs
        const products = await Product.find({ _id: { $in: productIds } }).limit(10)
            .populate("category", "name")
            .populate("subcategory", "name")
            .populate("seller", "name")
            .lean(); // Make it a plain JS object

        // Step 3: Merge sold count into product data
        const productsWithSales = products.map((product) => {
            const soldData = soldCounts.find(
                (item) => item._id.toString() === product._id.toString()
            );
            return {
                ...product,
                totalSold: soldData ? soldData.totalSold : 0,
            };
        });

        // Optional: sort again in case `Product.find` reorders them
        productsWithSales.sort((a, b) => b.totalSold - a.totalSold);

        res.status(200).json({
            success: true,
            count: productsWithSales.length,
            products: productsWithSales,
        });
    } catch (error) {
        console.error("Error fetching popular products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch popular products",
        });
    }
};
