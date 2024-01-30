import { ProductT } from '../data';

export default function findProductVariantWithIMEI(
  products: ProductT[],
  targetIMEI: string
) {
  for (const product of products) {
    for (const variant of product?.variants || []) {
      if (Object.values(variant.imeis).flat().includes(targetIMEI)) {
        return {
          product,
          variant: {
            color: Object.keys(variant.imeis).find((color) =>
              variant.imeis[color].includes(targetIMEI)
            ),
            imei: targetIMEI,
            ram: variant.ram,
            rom: variant.rom,
            processor: variant.processor,
            price: variant.sale_price,
            purchase_price: variant.purchase_price,
          },
        };
      }
    }
  }

  return { variant: null, product: null };
}
