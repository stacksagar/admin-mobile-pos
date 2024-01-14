import { TableCell, TableRow } from '@mui/material';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import { usePOS } from '../../context/pos/pos';
import { getDiscount, getQuantity, getSubTotal, getVat } from './functions';
import { useEffect } from 'react';

export default function POSDetailsTable() {
  const {
    products,
    discount,
    vat,
    paid,
    paymentMethod,
    sub_total_amount,
    discount_amount,
    vat_amount,
    payable_amount,
  } = usePOS();

  useEffect(() => {
    const subTotal = getSubTotal(products.data) || 0;
    const discountTotal = getDiscount(subTotal, discount.data) || 0;
    const vatTotal = getVat(subTotal, vat.data) || 0;

    sub_total_amount.set(subTotal);
    discount_amount.set(discountTotal);
    vat_amount.set(vatTotal);
    payable_amount.set(subTotal - discountTotal);
  }, [products]);

  return (
    <BasicTable>
      <TableRow>
        <TableCell>
          <b>Quantity =</b>
        </TableCell>
        <TableCell> {getQuantity(products.data)} Items </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Sub Total =</b>
        </TableCell>
        <TableCell> {sub_total_amount.value || 0} </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Discount =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-2">
            <span>{discount_amount?.value || 0}</span>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Vat Amount =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-2">
            <span>{vat_amount?.value || 0}</span>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Total =</b>
        </TableCell>
        <TableCell>{payable_amount?.value || 0}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Pay =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-1">
            <span>{paid.value || 0}</span>
            <small>
              {paymentMethod?.data?.name
                ? `paid by (${paymentMethod?.data?.name})`
                : null}
            </small>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <h3 className="text-xl font-bold">Due =</h3>
        </TableCell>
        <TableCell>
          <h3 className="text-xl font-medium">
            {(payable_amount?.value || 0) - Number(paid.value || '0')}
          </h3>
        </TableCell>
      </TableRow>
    </BasicTable>
  );
}
