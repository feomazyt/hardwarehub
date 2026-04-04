import { getProductList } from "@/lib/controllers/products.controller";

export async function GET(request: Request) {
  return getProductList(request);
}
