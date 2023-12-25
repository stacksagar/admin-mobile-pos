import { Button, CircularProgress, IconButton } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store';
import useFetchDispatch from '../../hooks/redux/useFetchDispatch';
import { fetchPayments } from '../../app/features/payments/requests';
import useBoolean from '../../hooks/state/useBoolean';
import AddPaymentPopup from '../Payments/AddPaymentPopup';
import AddDiscountPopup from '../Discounts/AddDiscountPopup';
import AddVatPopup from '../Vats/AddVatPopup';
import { fetchDiscounts } from '../../app/features/discounts/requests';
import { fetchVats } from '../../app/features/vats/requests';
import MuiSelect from '../../common/MaterialUi/Forms/MuiSelect';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { usePOSData } from '../../context/pos';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import error_message from '../../utils/error_message';
import toast from '../../libs/toast';
import { updateProduct } from '../../app/features/products/stockInProductsSlice';
import { addSale } from '../../app/features/sales/salesSlice';
import { updateCustomer } from '../../app/features/customers/customerSlice';
import { getDiscount, getVat } from './functions';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import FIcon from '../../common/Icons/FIcon';

export default function PosFooter() {
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const invoiceCreating = useBoolean();
  const { data: discounts } = useAppSelector((state) => state.discounts);
  const { data: vats } = useAppSelector((state) => state.vats);
  const { data: payment_methods } = useAppSelector((state) => state.payments);

  useFetchDispatch({
    data: discounts,
    fetchFunc: fetchDiscounts,
  });
  useFetchDispatch({
    data: vats,
    fetchFunc: fetchVats,
  });
  useFetchDispatch({
    data: payment_methods,
    fetchFunc: fetchPayments,
  });

  const openAddDiscountModal = useBoolean();
  const openAddVatModal = useBoolean();
  const openAddMethodModal = useBoolean();

  const {
    customer,
    setDiscount,
    setVat,
    setMethod,
    status,
    setStatus,
    payAmount,
    discount,
    warranty,
    vat,
    method,
    posProducts,
    invoiceID,
    total_payable,
    onClearPOS,
    vat_amount,
  } = usePOSData();

  const showClearConfirmation = useBoolean();

  async function handleCreateInvoice() {
    if (posProducts.length === 0)
      return toast({ message: 'Select product!', type: 'warning' });

    invoiceCreating.setTrue();
    try {
      await axios.post('/vat-amount', { amount: vat_amount.value });
      for (let i = 0; i < posProducts.length; i++) {
        const product = posProducts[i];
        const { data: updateInfo } = await axios.put(`/product/${product.id}`, {
          total_sale: (product?.total_sale || 0) + product.quantity,
          in_stock: (product?.in_stock || 0) - product.quantity,
        });
        updateInfo?.product && dispatch(updateProduct(updateInfo?.product));

        const { data: customerInfo } = await axios.put(
          `/customer/${customer.id}`,
          {
            due: (customer?.due || 0) + (total_payable.value - payAmount.value),
          }
        );

        customerInfo?.customer &&
          dispatch(updateCustomer(customerInfo?.customer));

        const newSaleData = {
          product,
          invoiceID,
          payAmount: payAmount.value / posProducts.length,
          saleAmount: product?.total_price,
          purchaseAmount: product.purchase_price * product?.quantity,
          status,
          customerId: customer.id,
          warrantyId: warranty.id,
          methodId: method.id,
          discount:
            getDiscount(total_payable.value, discount) / posProducts.length,
          vat: getVat(total_payable.value, vat) / posProducts.length,
        };

        const { data: saleInfo } = await axios.post(`/sale`, newSaleData);
        saleInfo?.sale && dispatch(addSale(saleInfo?.sale));
      }
    } catch (error) {
      toast({
        message: error_message(error),
      });
    } finally {
      navigate('/pos_invoice');

      // Also remove from localStorage
      localStorage.removeItem('pos');
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <AddDiscountPopup openModal={openAddDiscountModal} />
      <AddVatPopup openModal={openAddVatModal} />
      <AddPaymentPopup openModal={openAddMethodModal} />

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={discount?.name ? 'Discount' : 'Select Discount'}
          defaultTitle={discount?.name || null}
          options={discounts}
          titleKey="name"
          onChange={setDiscount}
        />
        <IconButton onClick={openAddDiscountModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={vat?.name ? 'Vat' : 'Select Vat'}
          defaultTitle={vat?.name || null}
          options={vats}
          titleKey="name"
          onChange={setVat}
        />
        <IconButton onClick={openAddVatModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center sm:pt-1">
        <MuiTextField
          label="Pay Today"
          type="number"
          value={payAmount.value || ''}
          onChange={payAmount.change}
        />
      </div>

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={method?.name ? 'Payment Method' : 'Select Payment Method'}
          defaultTitle={method?.name || null}
          options={payment_methods}
          titleKey="name"
          onChange={setMethod}
        />
        <IconButton onClick={openAddMethodModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center sm:pt-1">
        <MuiSelect
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { title: 'Pending', value: 'pending' },
            { title: 'Success', value: 'success' },
          ]}
        />
      </div>
      <div className="col-span-full flex items-center justify-end gap-2">
        <MuiConfirmationDialog
          showModal={showClearConfirmation}
          warningText={'Want to clear all POS data ? '}
          onConfirm={onClearPOS}
          confirmButtonText={'Yes, Clear All'}
        />

        <Button
          onClick={showClearConfirmation.setTrue}
          variant="contained"
          color="error"
        >
          Clear All
        </Button>
        <Button
          onClick={handleCreateInvoice}
          variant="contained"
          color="primary"
        >
          Create Invoice
          {invoiceCreating.true ? (
            <CircularProgress color="inherit" size={20} className="ml-2" />
          ) : null}
        </Button>
      </div>
    </div>
  );
}
