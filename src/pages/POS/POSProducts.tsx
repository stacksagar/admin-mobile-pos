import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import { Button, TableCell, TableRow } from '@mui/material';
import ChangeNumberField from '../../common/Forms/ChangeNumberField';
import { uid } from 'uid';
import { usePOS } from '../../context/pos/pos';
import { POSProductT } from '../../context/pos/POSContext';

type Props = {};

export default function POSProducts({}: Props) {
  const { products } = usePOS();

  function handleSubmitSalePrice(p: POSProductT) {
    return (_id: number, data: any) => {
      const sale_price = data?.sale_price || p?.sale_price;
      products.update(
        { ...p, sale_price, total_price: sale_price * p?.quantity },
        p?.with_variant ? 'imei' : 'id'
      );
    };
  }

  function handleSubmitQuantity(p: POSProductT) {
    return (_id: number, data: any) => {
      const quantity = data?.quantity || p?.quantity;
      if (quantity < 1) return;
      products.update(
        { ...p, quantity, total_price: p.sale_price * quantity },
        'id'
      );
    };
  }

  return (
    <div className="custom_muitable_shadow py-4">
      <BasicTable
        headers={[
          'Name',
          'Quantity',
          'In Stock',
          'Purchase Price',
          'Sale Price',
          'Total Price',
          'Actions',
        ]}
      >
        {products?.data?.map((product) => (
          <TableRow key={uid()}>
            <TableCell>
              <div className="whitespace-nowrap">
                {product?.name}
                {product?.with_variant ? (
                  <>
                    <p> Color: {product?.color} </p>
                    <p> RAM: {product?.ram} </p>
                    <p> ROM: {product?.rom} </p>
                    <p> IMEI: {product?.imei} </p>
                  </>
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              {product.with_variant ? (
                <p> {product?.quantity} </p>
              ) : (
                <ChangeNumberField
                  max={product?.in_stock}
                  defaultValue={product?.quantity || 1}
                  id={product?.id?.toString()}
                  handleSubmit={handleSubmitQuantity(product)}
                  keyName="quantity"
                />
              )}
            </TableCell>

            <TableCell>{product?.in_stock}</TableCell>
            <TableCell>{product?.purchase_price}</TableCell>
            <TableCell>
              <ChangeNumberField
                defaultValue={product?.sale_price || 0}
                id={product?.id?.toString()}
                handleSubmit={handleSubmitSalePrice(product)}
                keyName="sale_price"
              />
            </TableCell>
            <TableCell>{product?.total_price}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() =>
                  product?.with_variant
                    ? products.remove('imei', product?.imei)
                    : products.removeById(product?.id)
                }
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
