import { TableCell, TableRow } from '@mui/material';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import { usePOSData } from '../../context/pos';

export default function POSDetailsTable() {
  const {
    total_items_quantity,
    sub_total_amount,
    discount_amount,
    vat_amount,
    total_payable,
    discount,
    payAmount,
    vat,
  } = usePOSData();

  return (
    <BasicTable>
      <TableRow>
        <TableCell>
          <b>Quantity =</b>
        </TableCell>
        <TableCell>{total_items_quantity?.value} Items </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Sub Total =</b>
        </TableCell>
        <TableCell> ৳ {sub_total_amount?.value} </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Discount =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-2">
            <span>৳ {discount_amount?.value}</span>
            <span>
              {discount?.type === 'percentage' ? `(${discount?.value}%)` : null}
            </span>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Vat Amount =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-2">
            <span>৳ {vat_amount.value}</span>
            <span>{vat?.type === 'percentage' ? `(${vat?.value}%)` : null}</span>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Total =</b>
        </TableCell>
        <TableCell> {total_payable?.value}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Pay =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-2">৳ {payAmount?.value}</div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <h3 className="text-xl font-bold">Due =</h3>
        </TableCell>
        <TableCell>
          <h3 className="text-xl font-medium">
            ৳ {total_payable?.value - payAmount?.value}
          </h3>
        </TableCell>
      </TableRow>
    </BasicTable>
  );
}
