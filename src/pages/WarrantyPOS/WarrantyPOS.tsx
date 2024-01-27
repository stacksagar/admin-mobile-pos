import { IconButton } from '@mui/material';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { ProductT, UserT } from '../../data';
import useCustomers from '../../hooks/react-query/useCustomers';
import useBoolean from '../../hooks/state/useBoolean';
import useObject from '../../hooks/state/useObject';
import useString from '../../hooks/state/useString';
import FIcon from '../../common/Icons/FIcon';
import AddCustomerPopup from '../Customers/AddCustomerPopup';
import useProducts from '../../hooks/react-query/useProducts';
import { Link } from 'react-router-dom';

export default function WarrantyPOS() {
  const openAddCustomerPopup = useBoolean();
  const paid = useString();
  const { customers } = useCustomers();
  const { products } = useProducts();
  const customer = useObject({} as UserT);
  const product = useObject({} as ProductT);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Product'}
          defaultTitle={product?.data?.name}
          options={products?.map((p) => ({
            ...p,
            uid: `${p.name} (${p?.barcode})`,
          }))}
          titleKey="uid"
          onChange={product.set}
        />

        <Link to="/add-product">
          <IconButton>
            <FIcon icon="plus" />
          </IconButton>
        </Link>
      </div>
    </div>
  );
}
