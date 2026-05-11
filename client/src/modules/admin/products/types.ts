export type CreateAdminProductInput = {
  categoryId: number;
  name: string;
  description?: string;
  variants: {
    size: string;
    color: string;
    sku: string;
    stock: number;
    price: number;
  }[];
  images: File[];
};
