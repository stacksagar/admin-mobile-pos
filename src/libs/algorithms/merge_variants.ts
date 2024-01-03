import { ProductVariant } from '../../data';

export default function mergeVariants(
  prevVariants: ProductVariant[],
  newVariants: ProductVariant[]
): ProductVariant[] {
  const mergedVariants: ProductVariant[] = [];

  for (const newVariant of newVariants) {
    const matchingPrevVariant = prevVariants.find(
      (prevVariant) =>
        prevVariant.processor?.toLocaleLowerCase()?.trim() ===
          newVariant.processor?.toLocaleLowerCase()?.trim() &&
        prevVariant.ram?.toLocaleLowerCase()?.trim() ===
          newVariant.ram?.toLocaleLowerCase()?.trim() &&
        prevVariant.rom?.toLocaleLowerCase()?.trim() ===
          newVariant.rom?.toLocaleLowerCase()?.trim()
    );

    if (matchingPrevVariant) {
      // If a matching variant is found, merge IMEIs based on color
      if (newVariant.imeis) {
        for (const color of Object.keys(newVariant.imeis)) {
          matchingPrevVariant.imeis[color] = [
            ...(matchingPrevVariant.imeis[color] || []),
            ...(newVariant.imeis[color] || []),
          ];
        }
      }
      // Update other properties if needed
      matchingPrevVariant.purchase_price = newVariant.purchase_price;
      matchingPrevVariant.sale_price = newVariant.sale_price;

      // Add the updated variant to the merged list
      mergedVariants.push(matchingPrevVariant);
    } else {
      // If no matching variant is found, add the new variant to the merged list
      mergedVariants.push(newVariant);
    }
  }

  // Add remaining prevVariants to mergedVariants (if any)
  for (const prevVariant of prevVariants) {
    const isVariantAlreadyAdded = mergedVariants.some(
      (mergedVariant) => mergedVariant.uid === prevVariant.uid
    );
    if (!isVariantAlreadyAdded) {
      mergedVariants.push(prevVariant);
    }
  }

  return mergedVariants;
}
