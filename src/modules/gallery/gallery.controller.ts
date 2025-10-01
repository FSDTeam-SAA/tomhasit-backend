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

const getAllGalleries = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // default values

  const result = await galleryService.getAllGalleries(
    Number(page),
    Number(limit)
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Galleries fetched successfully",
    data: result.galleries,
    meta: result.meta,
  });
});


const getGalleryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await galleryService.getGalleryById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Gallery fetched successfully",
    data: result,
  });
});

const updateGallery = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await galleryService.updateGallery(id, req.body, req.file);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Gallery updated successfully",
    data: result,
  });
});

const deleteGallery = catchAsync(async (req, res) => {
  const { id } = req.params;
  await galleryService.deleteGallery(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Gallery deleted successfully",
  });
});

const galleryController = {
  addGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};

export default galleryController;
