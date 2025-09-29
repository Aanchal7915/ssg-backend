import User from "../../models/userModel.js";
import Product from "../../models/productModel.js";
import Orders from "../../models/orderModel.js";
import Category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";
import RatingAndReview from "../../models/ratingAndReviewModel.js";


// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Active users
    const activeUsers = await User.countDocuments({ isActive: true });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Total categories
    const totalCategories = await Category.countDocuments();

    // Total orders
    const totalOrders = await Orders.countDocuments();

    // Total revenue
    const revenueData = await Orders.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Orders per status
    const ordersPerStatus = await Orders.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    // // Top selling products
    // const topProducts = await Orders.aggregate([
    //   { $unwind: "$products" },
    //   {
    //     $group: {
    //       _id: "$products.productId",
    //       quantitySold: { $sum: "$products.quantity" },
    //     },
    //   },
    //   { $sort: { quantitySold: -1 } },
    //   { $limit: 5 },
    // ]);


    const topProducts = await Orders.aggregate([
      { $unwind: "$products" },

      // Convert products.productId from string to ObjectId to enable lookup
      {
        $addFields: {
          "products.productId": {
            $toObjectId: "$products.productId"
          }
        }
      },

      // Group by productId and sum quantity sold
      {
        $group: {
          _id: "$products.productId",
          quantitySold: { $sum: "$products.quantity" },
        },
      },

      // Sort descending by quantitySold
      { $sort: { quantitySold: -1 } },

      // Limit to top 5
      { $limit: 5 },

      // Join with products collection to get product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // Flatten the productDetails array
      { $unwind: "$productDetails" },

      // Project fields to return
      {
        $project: {
          _id: 1,
          quantitySold: 1,
          "productDetails.name": 1,
          "productDetails.price": 1,
          "productDetails.discountPrice": 1,
          "productDetails.brand.name": 1,
          "productDetails.images": 1,
        },
      },
    ]);


    // Average rating per product
    const ratings = await RatingAndReview.aggregate([
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          reviewsCount: { $sum: 1 },
        },
      },
      { $sort: { avgRating: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      ordersPerStatus,
      topProducts,
      ratings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


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
