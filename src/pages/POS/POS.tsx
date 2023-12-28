import POSProducts from './POSProducts';
import POSHeaderSelector from './POSHeaderSelector';
import POSDetailsTable from './POSDetailsTable';
import POSFooter from './POSFooter';
import { usePOSData } from '../../context/pos';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import { TableCell, TableRow } from '@mui/material';

export default function POS() {
  const { customer, warranty, method } = usePOSData();
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
              <TableCell>{customer?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Address</b>
              </TableCell>
              <TableCell>{customer?.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Phone</b>
              </TableCell>
              <TableCell>{customer?.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>{customer?.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b className="text-lg">Customer Due</b>
              </TableCell>
              <TableCell>
                <span className="text-base">{customer?.due}</span>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <b>Warranty</b>
              </TableCell>
              <TableCell>{warranty?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>Payment Method</b>
              </TableCell>
              <TableCell>{method?.name}</TableCell>
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