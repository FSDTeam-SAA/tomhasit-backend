import { Router } from "express";
import galleryController from "./gallery.controller";
import { upload } from "../../middleware/multer.middleware";

const router = Router();

router.post(
  "/add-gallery",
  upload.single("image"),
  galleryController.addGallery
);

router.get("/all-galleries", galleryController.getAllGalleries);

router.get("/:id", galleryController.getGalleryById);

router.put(
  "/update/:id",
  upload.single("image"),
  galleryController.updateGallery
);

const galleryRouter = router;
export default galleryRouter;
