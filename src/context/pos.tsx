import { createContext, useContext, useState, useEffect } from 'react';
import useNumber, { UseNumber } from '../hooks/state/useNumber';

import {
  getDiscount,
  getQuantity,
  getSubTotal,
  getVat,
} from '../pages/POS/functions';

interface Context {
  posProducts: PosProduct[];
  setPOSProducts: React.Dispatch<React.SetStateAction<PosProduct[]>>;
  setPOSProduct: (product: Product) => void;
  removePOSProduct: (id: number) => void;
  updatePOSProduct: (id: number, data: object) => void;
  warranty: Warranty;
  discount: Discount;
  vat: Vat;
  method: Payment;
  setWarranty: React.Dispatch<React.SetStateAction<Warranty>>;
  setDiscount: React.Dispatch<React.SetStateAction<Discount>>;
  setVat: React.Dispatch<React.SetStateAction<Vat>>;
  setMethod: React.Dispatch<React.SetStateAction<Payment>>;
  status: POSStatus;
  setStatus: React.Dispatch<React.SetStateAction<any>>;
  payAmount: UseNumber;
  customer: Customer;
  setCustomer: React.Dispatch<React.SetStateAction<Customer>>;

  //
  total_items_quantity: UseNumber;
  discount_amount: UseNumber;
  sub_total_amount: UseNumber;
  vat_amount: UseNumber;
  total_payable: UseNumber;

  //
  invoiceID: number;
  setInvoiceID: React.Dispatch<React.SetStateAction<number>>;
  invoiceData: string;
  setSaleDataToPOS: (sale: Sale) => void;
  sale: Sale;

  // clear func
  onClearPOS: () => void;
}

const POSContext = createContext<Context>({} as Context);

export function POSProvider({ children }: { children: React.ReactNode }) {
  const savedData = JSON.parse(localStorage.getItem('pos') || '{}');

  const [posProducts, setPOSProducts] = useState<PosProduct[]>(
    savedData?.posProducts || []
  );

  function setPOSProduct(product: Product) {
    if (!product) return;

    setPOSProducts((prev) => {
      const prevProduct = prev.find((p) => p.id === product.id);
      if (prevProduct) {
        return prev.map((p) => {
          let quantity = prevProduct.quantity + 1;
          quantity > (p?.in_stock || 0) && (quantity = p?.in_stock || 0);
          return p.id === prevProduct.id
            ? {
                ...prevProduct,
                total_price: p.sale_price * quantity,
                quantity,
              }
            : p;
        });
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            total_price: product.sale_price,
          },
        ];
      }
    });
  }

  function removePOSProduct(id: number) {
    setPOSProducts((previous) => {
      return previous.filter((p) => p.id !== id);
    });
  }

  function updatePOSProduct(id: number, data: any) {
    if (data?.quantity && data?.quantity < 1) {
      data.quantity = 1;
    }

    setPOSProducts((prev) => {
      // return data?.quantity ?
      return prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              total_price:
                (data?.quantity ? data?.quantity : p?.quantity) *
                (data?.sale_price ? data?.sale_price : p.sale_price),
            }
          : p
      );
      // : prev.map((p) => (p.id === id ? { ...p, ...data } : p));
    });
  }

  const [customer, setCustomer] = useState<Customer>(
    savedData?.customer || ({} as Customer)
  );
  const [status, setStatus] = useState<POSStatus>(
    savedData?.status || 'success'
  );
  const [discount, setDiscount] = useState<Discount>(
    savedData?.discount || ({} as Discount)
  );
  const [warranty, setWarranty] = useState<Warranty>(
    savedData?.warranty || ({} as Warranty)
  );
  const [vat, setVat] = useState<Vat>(savedData?.vat || ({} as Vat));
  const [method, setMethod] = useState<Payment>(
    savedData?.method || ({} as Payment)
  );

  const payAmount = useNumber(Number(savedData?.payAmount) || 0);

  const total_items_quantity = useNumber(0);
  const discount_amount = useNumber(0);
  const sub_total_amount = useNumber(0);
  const vat_amount = useNumber(0);
  const total_payable = useNumber(0);

  const [invoiceID, setInvoiceID] = useState(
    Math.floor(Math.random() * 9999999999)
  );

  const [invoiceData, setInvoiceData] = useState<string>(
    new Date().toISOString()
  );

  const [sale, setSale] = useState({} as Sale);
  function setSaleDataToPOS(sale: Sale, avoid_set_data?: boolean) {
    setSale(sale);
    if (avoid_set_data) return;

    if (!sale.id) return;
    setCustomer(sale.customer);
    setInvoiceID(sale?.invoiceID);
    setInvoiceData(sale.createdAt);
    setPOSProducts(
      typeof sale?.product === 'string'
        ? [JSON.parse(sale.product)]
        : [sale.product]
    );
    payAmount.setCustom(sale.payAmount);

    setWarranty(sale?.warranty as Warranty);

    setDiscount({ value: sale?.discount } as Discount);
    setVat({ value: sale?.vat } as Vat);
  }

  useEffect(() => {
    localStorage.setItem(
      'pos',
      JSON.stringify({
        posProducts,
        customer,
        status,
        discount,
        warranty,
        vat,
        method,
        payAmount: payAmount.value,
      })
    );

    total_items_quantity.setCustom(getQuantity(posProducts));
    sub_total_amount.setCustom(getSubTotal(posProducts));
    discount_amount.setCustom(getDiscount(getSubTotal(posProducts), discount));
    vat_amount.setCustom(getVat(getSubTotal(posProducts), vat));
  }, [
    posProducts,
    customer,
    status,
    discount,
    warranty,
    vat,
    method,
    payAmount,
  ]);

  useEffect(() => {
    total_payable.setCustom(
      sub_total_amount.value + vat_amount.value - discount_amount.value
    );
  }, [discount_amount, vat_amount, sub_total_amount]);

  function onClearPOS() {
    setCustomer({} as Customer);
    setPOSProducts([]);
    setDiscount({} as Discount);
    setMethod({} as Payment);
    setWarranty({} as Warranty);
    setVat({} as Vat);
    payAmount.setCustom(0);
  }

  return (
    <POSContext.Provider
      value={{
        posProducts,
        setPOSProducts,
        setPOSProduct,
        removePOSProduct,
        updatePOSProduct,

        invoiceID,
        setInvoiceID,

        warranty,
        setWarranty,
        discount,
        setDiscount,
        vat,
        setVat,
        method,
        setMethod,
        status,
        setStatus,
        payAmount,

        customer,
        setCustomer,

        // values
        total_items_quantity,
        discount_amount,
        sub_total_amount,
        vat_amount,
        total_payable,
        sale,
        invoiceData,
        setSaleDataToPOS,
        onClearPOS,
      }}
    >
      {children}
    </POSContext.Provider>
  );
}

export function usePOSData() {
  return useContext(POSContext);
}
