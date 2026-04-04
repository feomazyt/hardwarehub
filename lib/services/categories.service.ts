import * as categoriesRepository from "@/lib/repositories/categories.repository";

export async function listCategories() {
  return categoriesRepository.findAllOrderedByName();
}
