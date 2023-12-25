export default function remove_empty_value_keys(obj: any) {
  if (typeof obj !== 'object') return;

  const updatedObj = { ...obj };
  for (var key in updatedObj) {
    if (!updatedObj[key]) {
      delete updatedObj[key];
    }
  }
  return updatedObj;
}
