// controllers/reviewController.js
import RatingAndReview from "../../models/ratingAndReviewModel.js";

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const reviews = await RatingAndReview.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RatingAndReview.countDocuments({ product: productId });

    res.status(200).json({
      success: true,
      reviews,
      total,
      hasMore: skip + reviews.length < total,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
