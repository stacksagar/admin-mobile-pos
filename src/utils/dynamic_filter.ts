export default function dynamic_filter(
  arr: any[],
  keys?: string[],
  filterText?: string
) {
  return (arr || []).filter((item) => {
    if (!keys || !filterText) return arr;

    for (const key of keys) {
      const value = item[key];
      if (value && value.toLowerCase().includes(filterText.toLowerCase())) {
        return true;
      }
    }
    return false;
  });
}
