import { ProductT, UserT } from '../../data';
import { UseArray } from '../../hooks/state/useArray';
import { UseObject } from '../../hooks/state/useObject';

export interface POSProductT extends ProductT {
  color?: string;
  ram?: string;
  rom?: string;
  imei?: string;
  processor?: string;
  
  price: number;
  quantity: number;
  total_price: number;
}

export default interface POSContextType {
  customer: UseObject<UserT>;
  products: UseArray<POSProductT>;
}
