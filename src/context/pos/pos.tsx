import { createContext, useContext } from 'react';
import { DiscountT, PaymentT, UserT, VatT } from '../../data';
import useObject from '../../hooks/state/useObject';
import POSContextType, { POSProductT } from './POSContext';
import useArray from '../../hooks/state/useArray';
import useString from '../../hooks/state/useString';
import useNumber from '../../hooks/state/useNumber';

const POSContext = createContext({} as POSContextType);

export function POSProvider({ children }: { children: React.ReactNode }) {
  const products = useArray<POSProductT>([]);
  const customer = useObject<UserT>({} as UserT);
  const vat = useObject<VatT>({} as VatT);
  const discount = useObject<DiscountT>({} as DiscountT);
  const paymentMethod = useObject<PaymentT>({} as PaymentT);
  const paid = useString('');

  const invoice_id = useNumber(0);
  const sub_total_amount = useNumber(0);
  const discount_amount = useNumber(0);
  const vat_amount = useNumber(0);
  const payable_amount = useNumber(0);

  function onClearPOS() {
    products.reset();
    customer.reset();
    vat.reset();
    discount.reset();
    paymentMethod.reset();
    paid.reset();
    invoice_id.reset();
    sub_total_amount.reset();
    discount_amount.reset();
    vat_amount.reset();
    payable_amount.reset();
  }

  return (
    <POSContext.Provider
      value={{
        customer,
        products,
        vat,
        discount,
        paymentMethod,
        paid,
        sub_total_amount,
        discount_amount,
        vat_amount,
        payable_amount,
        invoice_id,
        onClearPOS,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOS() {
  return useContext(POSContext);
}
