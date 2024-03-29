import { TableCell, TableRow } from '@mui/material';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import POSInvoiceHeader from './POSInvoiceHeader';
import POSInvoiceFooter from './POSInvoiceFooter';
import { usePOS } from '../../context/pos/pos';
import { uid } from 'uid';
import Barcode from 'react-barcode';

export default function POSInvoice() {
  const {
    products,
    payable_amount,
    sub_total_amount,
    vat_amount,
    discount_amount,
    paid,
  } = usePOS();

  return (
    <div className="print_area mx-auto w-full rounded bg-white p-6 shadow-sm xl:max-w-screen-md">
      <POSInvoiceHeader />

      {/* Tables */}
      <div className="custom_muitable_shadow space-y-2 pb-4 pt-2">
        <BasicTable>
          <TableRow>
            <TableCell>
              <b>NAME</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>IMEI</b>
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
          {products?.data?.map((product) => (
            <TableRow key={uid()}>
              <TableCell>
                <div className=" max-w-[150px]">
                  <p className="font-medium">{product?.name}</p>
                  {product?.with_variant ? (
                    <>
                      <p className="font-medium">
                        RAM/ROM: {product?.ram}/{product?.rom}
                      </p>
                      <p className="font-medium"> Color: {product?.color} </p>
                    </>
                  ) : null}
                </div>
              </TableCell>

              <TableCell className="border-default border-l">
                {product?.imei ? (
                  <>
                    <Barcode height={30} value={product?.imei || ''} />
                  </>
                ) : (
                  '-'
                )}
              </TableCell>

              <TableCell className="border-default border-l">
                {product?.sale_price}
              </TableCell>
              <TableCell className="border-default border-l">
                {product?.quantity}
              </TableCell>

              <TableCell className="border-default border-l">
                {product?.total_price}
              </TableCell>
            </TableRow>
          ))}
        </BasicTable>
        <BasicTable size="small">
          <TableRow>
            <TableCell> TOTAL PRICE </TableCell>
            <TableCell> = </TableCell>
            <TableCell>
              {sub_total_amount.value - vat_amount?.value || 0}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> VAT </TableCell>
            <TableCell> = </TableCell>
            <TableCell>{vat_amount.value || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> DISCOUNT </TableCell>
            <TableCell> = </TableCell>
            <TableCell>{discount_amount.value || 0}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell> TOTAL </TableCell>
            <TableCell> = </TableCell>
            <TableCell>{payable_amount.value || 0}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell> Payment </TableCell>
            <TableCell> = </TableCell>
            <TableCell>{paid.value || 0}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Due </TableCell>
            <TableCell> = </TableCell>
            <TableCell>
              {payable_amount.value - Number(paid.value || '0')}
            </TableCell>
          </TableRow>
        </BasicTable>
      </div>

      <POSInvoiceFooter />
    </div>
  );
}
