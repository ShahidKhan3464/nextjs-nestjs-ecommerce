export type AdminCategoryOption = {
  id: number;
  name: string;
  description?: string | null;
};

export type CreateCategoryInput = {
  name: string;
  description?: string;
};
