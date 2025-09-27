export interface IGallery {
  _id: string;
  title: string;
  image: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
