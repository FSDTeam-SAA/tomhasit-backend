import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import Review from "./review.model";
import reviewService from "./review.service";

const addReview = catchAsync(async (req, res) => {
  const result = await reviewService.addReview(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review added successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // default page=1, limit=10

  const result = await reviewService.getAllReviews(Number(page), Number(limit));

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result.reviews,
    meta: result.meta, // return pagination info
  });
});


const addReviewReply = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const result = await reviewService.addReviewReply(reviewId, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review reply added successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  await reviewService.deleteReview(reviewId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Review deleted successfully",
  });
});

const reviewController = {
  addReview,
  getAllReviews,
  addReviewReply,
  deleteReview,
};

export default reviewController;
