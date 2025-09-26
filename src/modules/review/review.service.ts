import { IReview } from "./review.interface";
import Review from "./review.model";

const addReview = async (payload: IReview) => {
  const result = await Review.create(payload);
  return result;
};

const getAllReviews = async () => {
  const result = await Review.find().sort({ createdAt: -1 });
  return result;
};

const addReviewReply = async (reviewId: string, reply: { reply: string }) => {
  const existingReview = await Review.findById(reviewId);
  if (!existingReview) throw new Error("Review not found");

  const result = await Review.findByIdAndUpdate(
    reviewId,
    { reply: reply.reply },
    { new: true }
  );
  return result;
};

const deleteReview = async (reviewId: string) => {
  const existingReview = await Review.findById(reviewId);
  if (!existingReview) throw new Error("Review not found");

  await Review.findByIdAndDelete(reviewId);
};

const reviewService = {
  addReview,
  getAllReviews,
  addReviewReply,
  deleteReview,
};

export default reviewService;
