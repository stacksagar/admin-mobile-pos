import { TableCell, TableRow } from '@mui/material';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';

export default function POSDetailsTable() {
  return (
    
    <BasicTable>
      <TableRow>
        <TableCell>
          <b>Quantity =</b>
        </TableCell>
        <TableCell> 0 Items </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Sub Total =</b>
        </TableCell>
        <TableCell> ৳ 0 </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Discount =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-2">
            <span>৳ 0</span>
            <span> 0 </span>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Vat Amount =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-2">
            <span>৳0</span>
            <span>0</span>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Total =</b>
        </TableCell>
        <TableCell> 0 </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <b>Pay =</b>
        </TableCell>
        <TableCell>
          <div className="space-x-2">৳0</div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          <h3 className="text-xl font-bold">Due =</h3>
        </TableCell>
        <TableCell>
          <h3 className="text-xl font-medium">৳ 0</h3>
        </TableCell>
      </TableRow>
    </BasicTable>
  );
}
