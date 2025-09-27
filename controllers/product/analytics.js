import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import Orders from "../../models/orderModel.js";
import Category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";
import RatingAndReview from "../../models/ratingAndReviewModel.js";

// Advanced Analytics
export const getAdvancedAnalytics = async (req, res) => {
  try {
    // Revenue over last 30 days
    const revenueTrend = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyRevenue: { $sum: "$amount" },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top categories
    const topCategories = await Product.aggregate([
      { $group: { _id: "$category", totalSold: { $sum: "$stock" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $project: { name: "$category.name", totalSold: 1 } },
    ]);

    // Low stock alerts
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select("name stock");

    // Active vs inactive customers
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    // Response
    res.json({
      revenueTrend,
      topCategories,
      lowStockProducts,
      totalUsers,
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
