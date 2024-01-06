import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import { Button, TableCell, TableRow } from '@mui/material';
import ChangeNumberField from '../../common/Forms/ChangeNumberField';
import { POSProductT } from '../../context/pos/POSContext';
import { uid } from 'uid';

type Props = {};

export default function POSProducts({}: Props) {
  return (
    <div className="custom_muitable_shadow py-4">
      <BasicTable
        headers={[
          'Name',
          'Barcode NO',
          'Quantity',
          'In Stock',
          'Purchase Price',
          'Sale Price',
          'Total Price',
          'Actions',
        ]}
      >
        {([] as POSProductT[])?.map((product) => (
          <TableRow key={uid()}>
            <TableCell>{product?.name}</TableCell>
            <TableCell>{product?.barcode}</TableCell>
            <TableCell>
              <ChangeNumberField
                max={product?.in_stock}
                defaultValue={product?.quantity || 1}
                id={product?.id?.toString()}
                // handleSubmit={(id, data) => updatePOSProduct(id, data)}
                keyName="quantity"
              />
            </TableCell>

            <TableCell>{product?.in_stock}</TableCell>
            <TableCell>{product?.purchase_price}</TableCell>
            <TableCell>
              <ChangeNumberField
                defaultValue={product?.sale_price || 0}
                id={product?.id?.toString()}
                // handleSubmit={(id, data) => updatePOSProduct(id, data)}
                keyName="sale_price"
              />
            </TableCell>
            <TableCell>{product?.total_price}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                size="small"
                color="error"
                // onClick={() => removePOSProduct(product?.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </BasicTable>
    </div>
  );
}
