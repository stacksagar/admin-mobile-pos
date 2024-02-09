import { POSProductT } from '../../context/pos/POSContext';
import { DiscountT, VatT } from '../../data';

export function getQuantity(products: POSProductT[]): number {
  return products?.reduce((total, product) => total + product?.quantity, 0);
}

export function getSubTotal(products: POSProductT[]): number {
  return products?.reduce((total, product) => total + product?.total_price, 0);
}

export function getDiscount(total: number, discount: DiscountT) {
  const isByPercentage = discount?.type === 'percentage';
  if (isByPercentage) {
    return (total / 100) * discount?.value;
  } else {
    return discount?.value;
  }
}

export function getVat(total: number, vat: VatT) {
  if (!vat) return 0;
  const isByPercentage = vat?.type === 'percentage';
  if (isByPercentage) {
    return Math.ceil((total / 100) * vat?.value);
  } else {
    return vat?.value;
  }
}
