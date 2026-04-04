/** Kształt produktu w odpowiedzi listy (JSON) */
export type ProductListItemDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  stock: number;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  createdAt: string;
};

export type ProductListResponseDTO = {
  products: ProductListItemDTO[];
  total: number;
  limit: number;
  offset: number;
};

export type ProductDetailsDTO = ProductListItemDTO;
