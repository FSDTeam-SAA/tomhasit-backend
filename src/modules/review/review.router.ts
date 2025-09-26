import { Router } from "express";
import reviewController from "./review.controller";

const router = Router();

router.post("/add-review", reviewController.addReview);
router.get("/all-reviews", reviewController.getAllReviews);

router.put("/reply/:reviewId", reviewController.addReviewReply);

router.delete("/:reviewId", reviewController.deleteReview);

const reviewRouter = router;
export default reviewRouter;
