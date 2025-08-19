export type CommentModel = {
  id: number;
  productId: number;
  description: string;
  date: string; // "14:00 22.08.2021"
};

export type Product = {
  id: number;
  imageUrl: string;
  name: string;
  count: number;
  size: {
    width: number;
    height: number;
  };
  weight: string;
  comments?: number[];
};
