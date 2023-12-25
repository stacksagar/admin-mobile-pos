export function getQuantity(products: PosProduct[]): number {
  return products?.reduce((total, product) => total + product?.quantity, 0);
}

export function getSubTotal(products: PosProduct[]): number {
  return products?.reduce((total, product) => total + product?.total_price, 0);
}

export function getDiscount(total: number, discount: Discount) {
  const isByPercentage = discount?.type === 'percentage';
  if (isByPercentage) {
    return (total / 100) * discount?.value;
  } else {
    return discount?.value;
  }
}

export function getVat(total: number, vat: Vat) {
  const isByPercentage = vat?.type === 'percentage';
  if (isByPercentage) {
    return (total / 100) * vat?.value;
  } else {
    return vat?.value;
  }
}
