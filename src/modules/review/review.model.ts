import { model, Schema } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    fullName: { type: String, required: true },
    comment: { type: String, required: true },
    reply: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
);

const Review = model<IReview>("Review", reviewSchema);

export default Review;
