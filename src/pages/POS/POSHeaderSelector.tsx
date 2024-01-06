import { IconButton } from '@mui/material';
import FIcon from '../../common/Icons/FIcon';
import AddCustomerPopup from '../Customers/AddCustomerPopup';
import useBoolean from '../../hooks/state/useBoolean';
import { Link } from 'react-router-dom';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { useState } from 'react';
import { ProductT } from '../../data';
import useCustomers from '../../hooks/react-query/useCustomers';
import useProducts from '../../hooks/react-query/useProducts';
import { usePOS } from '../../context/pos/pos';
import { POSProductT } from '../../context/pos/POSContext';
import useObject from '../../hooks/state/useObject';

interface Props {}

export default function POSHeaderSelector({}: Props) {
  const { customer, products: pos_products } = usePOS();

  const { customers } = useCustomers();
  const { products } = useProducts();

  const selectedProduct = useObject({} as ProductT);

  const openAddCustomerPopup = useBoolean();

  const [barcode, setBarcode] = useState('');

  function handleWithScan(code: string) {
    setBarcode(code);
    const product = products.find((p) => p.barcode?.trim() === code?.trim());
    if (product?.id) {
      setBarcode('');
    }
  }

  function handleSelectProduct(product: ProductT) {
    selectedProduct.set(product);
    if (!product?.with_variant) {
      addWithoutVariantProduct(product);
    }
  }

  function addWithoutVariantProduct(product: ProductT) {
    const exist = pos_products?.data?.find((p) => p?.id === product?.id);

    const payable: POSProductT = {
      ...product,
      price: product.sale_price,
      quantity: 1,
      total_price: product.sale_price,
    };

    if (exist) {
    } else {
      pos_products.add(payable);
    }
  }

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:gap-6 xl:gap-12">
      <div className="flex items-center gap-2">
        <div className="mt-2">
          <MuiTextField
            value={barcode}
            onChange={(e) => handleWithScan(e.target.value)}
            label="Scan Barcode"
          />
        </div>

        <MuiSearchSelect
          label={'Select Product'}
          options={products?.map((p) => ({
            ...p,
            uid: `${p.name} (${p?.barcode})`,
          }))}
          titleKey="uid"
          onChange={handleSelectProduct}
        />

        <Link to="/add-product">
          <IconButton>
            <FIcon icon="plus" />
          </IconButton>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <AddCustomerPopup openModal={openAddCustomerPopup} />

        <MuiSearchSelect
          label={'Select Customer'}
          defaultTitle={customer?.data?.name || null}
          options={customers || []}
          titleKey="name"
          onChange={customer.set}
        />

        <IconButton onClick={openAddCustomerPopup.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>
    </div>
  );
}
