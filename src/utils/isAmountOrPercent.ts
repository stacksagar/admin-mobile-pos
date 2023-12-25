export default function isAmountOrPercent(
  type: 'amount' | 'percentage',
  currency?: string
) {
  return type === 'amount' ? currency || '৳' : '%';
}
