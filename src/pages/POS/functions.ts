export function getQuantity(products: any[]): number {
  return products?.reduce((total, product) => total + product?.quantity, 0);
}

export function getSubTotal(products: any[]): number {
  return products?.reduce((total, product) => total + product?.total_price, 0);
}

export function getDiscount(total: number, discount: any) {
  const isByPercentage = discount?.type === 'percentage';
  if (isByPercentage) {
    return (total / 100) * discount?.value;
  } else {
    return discount?.value;
  }
}

export function getVat(total: number, vat: any) {
  const isByPercentage = vat?.type === 'percentage';
  if (isByPercentage) {
    return (total / 100) * vat?.value;
  } else {
    return vat?.value;
  }
}
