export default function makeToSerializeDESC<T>(
  items: T[],
  page: number,
  limit: number,
  totalItems: number
) {
  return items.map((item, index) => {
    return {
      ...item,
      sl: totalItems - index - (page - 1) * limit,
    };
  });
}
