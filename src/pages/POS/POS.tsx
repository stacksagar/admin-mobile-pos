import POSFooter from './POSFooter';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import { TableCell, TableRow } from '@mui/material';
import POSDetailsTable from './POSDetailsTable';
import POSHeaderSelector from './POSHeaderSelector';
import POSProducts from './POSProducts';
import { usePOS } from '../../context/pos/pos';

export default function POS() {
  const { customer, paymentMethod } = usePOS();

  return (
    <div className="space-y-2 md:bg-white md:p-8 md:dark:bg-black">
      <POSHeaderSelector />
      <POSProducts />
      <div className="custom_muitable_shadow grid grid-cols-2 gap-8">
        <div className="flex flex-col items-start gap-6">
          <BasicTable>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>{customer?.data?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Address</b>
              </TableCell>
              <TableCell>{customer?.data?.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Phone</b>
              </TableCell>
              <TableCell>{customer?.data?.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>{customer?.data?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b className="text-lg">Customer Due</b>
              </TableCell>
              <TableCell>
                <span className="text-base">{customer?.data?.due}</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <b>Payment Method</b>
              </TableCell>
              <TableCell>{paymentMethod?.data?.name}</TableCell>
            </TableRow>
          </BasicTable>
        </div>
        <POSDetailsTable />
      </div>
      <br />
      <POSFooter />
    </div>
  );
}
