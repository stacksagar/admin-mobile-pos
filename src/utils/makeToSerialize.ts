export default function makeToSerialize(
  items: any,
  page?: number,
  limit?: number
) {
  if (!items || !page || !limit) return;

  return items.map((item: any, index: any) => {
    return {
      ...item,
      sl: limit * (page - 1) + (index + 1),
    };
  });
}
