import { TableCell, TableRow } from '@mui/material';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import POSInvoiceHeader from './POSInvoiceHeader';
import POSInvoiceFooter from './POSInvoiceFooter';
import { usePOSData } from '../../context/pos';
import { uid } from 'uid';
import { ProductT } from '../../data';

export default function POSInvoice() {
  const {
    posProducts,
    sub_total_amount,
    discount_amount,
    vat_amount,
    total_payable,
    payAmount,
    invoiceID,
    setInvoiceID,
  } = usePOSData();

  return (
    <div className="print_area mx-auto w-full rounded bg-white p-6 shadow-sm xl:max-w-screen-md">
      <POSInvoiceHeader invoiceID={invoiceID} />

      {/* Tables */}
      <div className="custom_muitable_shadow space-y-2 pb-4 pt-2">
        <BasicTable>
          <TableRow>
            <TableCell>
              <b>NAME</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>CODE</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>PRICE</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>QTY</b>
            </TableCell>

            <TableCell className="border-default border-l">
              <b>TOTAL</b>
            </TableCell>
          </TableRow>
          {posProducts?.map((product) => (
            <TableRow key={uid()}>
              <TableCell>
                {product?.products?.length ? (
                  <div>
                    {product?.products?.map((p: ProductT) => (
                      <div key={Math.random()}> {p?.name} </div>
                    ))}
                  </div>
                ) : (
                  <div className=" max-w-[150px]">{product?.name}</div>
                )}
              </TableCell>
              <TableCell className="border-default border-l">
                {product?.barcode}
              </TableCell>
              <TableCell className="border-default border-l">
                ৳{product?.sale_price}
              </TableCell>
              <TableCell className="border-default border-l">
                {product?.quantity}
              </TableCell>

              <TableCell className="border-default border-l">
                ৳{product?.total_price}
              </TableCell>
            </TableRow>
          ))}
        </BasicTable>
        <BasicTable size="small">
          <TableRow>
            <TableCell> SUBTOTAL </TableCell>
            <TableCell> = </TableCell>
            <TableCell>৳{sub_total_amount.value}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> VAT </TableCell>
            <TableCell> = </TableCell>
            <TableCell>৳{vat_amount.value}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> DISCOUNT </TableCell>
            <TableCell> = </TableCell>
            <TableCell>৳{discount_amount.value}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> TOTAL </TableCell>
            <TableCell> = </TableCell>
            <TableCell>৳{total_payable.value}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Payment </TableCell>
            <TableCell> = </TableCell>
            <TableCell>৳{payAmount.value}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Due </TableCell>
            <TableCell> = </TableCell>
            <TableCell>৳{total_payable.value - payAmount.value}</TableCell>
          </TableRow>
        </BasicTable>
      </div>

      <POSInvoiceFooter invoiceID={invoiceID} setInvoiceID={setInvoiceID} />
    </div>
  );
}
