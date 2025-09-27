import { model, Schema } from "mongoose";

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Gallery = model("Gallery", gallerySchema);

export default Gallery;
