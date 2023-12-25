import { usePOSData } from '../../context/pos';
import { useAppSelector } from '../../app/store';
import useFetchDispatch from '../../hooks/redux/useFetchDispatch';
import { fetchStockInProducts } from '../../app/features/products/requests';
import { fetchCustomers } from '../../app/features/customers/requests';
import { IconButton } from '@mui/material';
import FIcon from '../../common/Icons/FIcon';
import AddCustomerPopup from '../Customers/AddCustomerPopup';
import useBoolean from '../../hooks/state/useBoolean';
import { Link } from 'react-router-dom';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';

interface Props {}

export default function POSHeaderSelector({}: Props) {
  const { data: products } = useAppSelector((s) => s.products);
  const { data: customers } = useAppSelector((s) => s.customers);
  useFetchDispatch({
    data: products,
    fetchFunc: fetchStockInProducts,
  });

  useFetchDispatch({
    data: customers,
    fetchFunc: fetchCustomers,
  });

  const openAddCustomerPopup = useBoolean();

  const { setPOSProduct, customer, setCustomer } = usePOSData();

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:gap-6 xl:gap-12">
      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Product'}
          options={products}
          titleKey="name"
          onChange={setPOSProduct}
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
          label={customer?.name ? 'Customer' : 'Select Customer'}
          defaultTitle={customer?.name || null}
          options={customers}
          titleKey="name"
          onChange={setCustomer}
        />

        <IconButton onClick={openAddCustomerPopup.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>
    </div>
  );
}
