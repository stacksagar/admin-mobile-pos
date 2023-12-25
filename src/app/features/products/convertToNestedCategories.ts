import { CategoryT } from '../../../data';

export default function convertToNestedCategories(data: CategoryT[]) {
  if (!data || data?.length < 1) return [];

  const nestedArray: any[] = [];

  function findChildren(parentId?: number): CategoryT[] {
    const children = data.filter((item) => item?.parentId == parentId);

    if (children.length === 0) return [];

    return children.map((child) => ({
      ...child,
      children: findChildren(child.id),
    }));
  }

  nestedArray.push(...findChildren());
  return nestedArray;
}
