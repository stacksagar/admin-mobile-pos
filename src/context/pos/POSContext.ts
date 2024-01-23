import {
  DiscountT,
  PaymentT,
  ProductT,
  SingleVariant,
  UserT,
  VatT,
} from '../../data';
import { UseArray } from '../../hooks/state/useArray';
import { UseNumber } from '../../hooks/state/useNumber';
import { UseObject } from '../../hooks/state/useObject';
import { UseString } from '../../hooks/state/useString';

export type PPT = ProductT & SingleVariant;

export interface POSProductT extends PPT {
  quantity: number;
  total_price: number;
}

export default interface POSContextType {
  invoice_id: UseNumber;

  products: UseArray<POSProductT>;
  customer: UseObject<UserT>;
  vat: UseObject<VatT>;
  discount: UseObject<DiscountT>;
  paymentMethod: UseObject<PaymentT>;

  paid: UseString;
  sub_total_amount: UseNumber;
  discount_amount: UseNumber;
  vat_amount: UseNumber;
  payable_amount: UseNumber;
  onClearPOS(): void;
}
