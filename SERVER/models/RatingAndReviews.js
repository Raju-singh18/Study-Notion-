const mongoose = require("mongoose");

const ratingAndReviewsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Optional: Prevent duplicate reviews per course per user
ratingAndReviewsSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("RatingAndReviews", ratingAndReviewsSchema);
