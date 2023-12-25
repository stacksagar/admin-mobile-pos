export default function findCategory(
  id: number,
  categories: Category[]
): Category | undefined {
  return categories.find((c) => c.id === id);
}
