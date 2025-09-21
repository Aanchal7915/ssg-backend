import RatingAndReview from "../../models/ratingAndReviewModel.js";

// Get all reviews by logged-in user
const getMyReviews = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    const reviews = await RatingAndReview.find({ user: userId })
      .populate("product", "name images price") // populate product details
      .sort({ createdAt: -1 }); // newest first

    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export default getMyReviews;