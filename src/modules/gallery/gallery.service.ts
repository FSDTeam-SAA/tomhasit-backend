import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary";
import { IGallery } from "./gallery.interface";
import Gallery from "./gallery.model";

const addGallery = async (payload: IGallery, file: any) => {
  if (!file) {
    throw new Error("Image is required");
  }

  const uploadResult = await uploadToCloudinary(file.path, "gallery");

  const newImage = {
    public_id: uploadResult.public_id,
    url: uploadResult.secure_url,
  };

  let result;
  try {
    result = await Gallery.create({
      ...payload,
      image: newImage,
    });

    // Only delete old image if DB save succeeds
    if (payload.image?.public_id) {
      await deleteFromCloudinary(payload.image.public_id);
    }
  } catch (error) {
    // Rollback newly uploaded image if DB save fails
    await deleteFromCloudinary(newImage.public_id);
    throw error;
  }

  return result;
};

const getAllGalleries = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const galleries = await Gallery.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Gallery.countDocuments();

  return {
    galleries,
    meta: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};


const getGalleryById = async (id: string) => {
  const result = await Gallery.findById(id);
  return result;
};

const updateGallery = async (id: string, payload: IGallery, file: any) => {
  // eslint-disable-next-line prefer-const
  let updateData: any = { ...payload };
  let oldImagePublicId: string | undefined;

  if (file) {
    const uploadResult = await uploadToCloudinary(file.path, "gallery");
    oldImagePublicId = payload.image?.public_id;

    updateData.image = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  }

  const result = await Gallery.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  if (file && oldImagePublicId) {
    await deleteFromCloudinary(oldImagePublicId);
  }

  return result;
};

const deleteGallery = async (id: string) => {
  const gallery = await Gallery.findById(id);
  if (!gallery) {
    throw new Error("Gallery not found");
  }

  await Gallery.findByIdAndDelete(id);
};

const galleryService = {
  addGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};

export default galleryService;
