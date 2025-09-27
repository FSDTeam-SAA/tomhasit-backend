import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import galleryService from "./gallery.service";

const addGallery = catchAsync(async (req, res) => {
  const result = await galleryService.addGallery(req.body, req.file);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Gallery added successfully",
    data: result,
  });
});

const galleryController = {
  addGallery,
};

export default galleryController;
