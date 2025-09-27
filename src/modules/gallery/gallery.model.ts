import { model, Schema } from "mongoose";

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const Gallery = model("Gallery", gallerySchema);

export default Gallery;
