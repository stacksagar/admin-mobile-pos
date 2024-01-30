export default function filterItems<T>(
  items?: any[],
  value?: any,
  keys?: (keyof T)[]
) {
  if (!items?.length) return [];
  const filter_keys = keys ? keys : (Object.keys(items[0]) as any);

  return items?.filter((item) => {
    return filter_keys?.some((key: any) => {
      return item[key]
        ?.toString()
        ?.toLowerCase()
        ?.includes(value?.trim()?.toLowerCase());
    });
  });
}
