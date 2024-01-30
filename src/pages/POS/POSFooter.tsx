import { Button, CircularProgress, IconButton } from '@mui/material';
import useBoolean from '../../hooks/state/useBoolean';
import AddPaymentPopup from '../PaymentsOld/AddPaymentPopup';
import AddDiscountPopup from '../Discounts/AddDiscountPopup';
import AddVatPopup from '../Vats/AddVatPopup';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import FIcon from '../../common/Icons/FIcon';
import useVats from '../../hooks/react-query/useVats';
import { usePOS } from '../../context/pos/pos';
import useDiscounts from '../../hooks/react-query/useDiscounts';
import usePaymentMethods from '../../hooks/react-query/usePaymentMethods';
import { useNavigate } from 'react-router-dom';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { SaleT } from '../../data';

export default function PosFooter() {
  const navigate = useNavigate();

  const axios = useAxiosPrivate();
  const {
    vat,
    discount,
    paymentMethod,
    paid,
    products,
    customer,
    discount_amount,
    vat_amount,
    payable_amount,
    onClearPOS,
  } = usePOS();
  const invoiceCreating = useBoolean();
  const openAddDiscountModal = useBoolean();
  const openAddVatModal = useBoolean();
  const openAddMethodModal = useBoolean();
  const showClearConfirmation = useBoolean();

  const { vats, refetchVats } = useVats();
  const { discounts, refetchDiscounts } = useDiscounts();
  const { paymentMethods, refetchMethods } = usePaymentMethods();

  async function handleCreateSale() {
    if (products?.data?.length === 0) {
      toast({
        message: 'Please select a product!',
        type: 'warning',
      });
      return;
    }

    if (!customer?.data?.name) {
      toast({
        message: 'Please select a customer!',
        type: 'warning',
      });
      return;
    }

    try {
      let paid_amount = Number(paid.value) || 0;

      axios.put(`/customer/add-amount/${customer?.data?.id}`, {
        paid: paid_amount,
        due: payable_amount.value - paid_amount,
      });

      for (let i = 0; i < products.data?.length; i++) {
        const product = products.data[i];

        let paid = 0;
        if (paid_amount > product.total_price) {
          paid = product.total_price;
        } else if (paid_amount < product.total_price) {
          paid = paid_amount;
        } else if (paid_amount < 1) {
          paid_amount = 0;
          paid = 0;
        }

        const newSaleData: SaleT = {
          paid,
          due: product?.total_price - paid,
          discount: discount_amount.value,
          vat: vat_amount.value,
          quantity: product.quantity,
          total: product.total_price,
          total_purchase_cost:
            (product.purchase_price || 0) * (product.quantity || 1),
          method: paymentMethod?.data?.name,
          with_variant: false,
          productId: product?.id,
          customerId: customer?.data?.id,
        };

        if (product?.with_variant) {
          axios.put(`/product/remove-imeis/${product.id}`, {
            quantity: product.quantity,
            imei: product?.imei,
          });
          newSaleData.with_variant = true;
          newSaleData.properties = {
            processor: product?.processor,
            ram: product?.ram,
            rom: product?.rom,
            imei: product?.imei,
            color: product?.color,
          };
        } else {
          axios.put(`/product/occurred-sale/${product.id}`, {
            quantity: product.quantity,
          });
        }

        await axios.post<SaleT>(`/sale`, newSaleData);

        paid_amount = paid_amount - paid;
      }
    } catch (error) {
      toast({
        message: error_message(error),
      });
    } finally {
      navigate('/pos_invoice');
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <AddVatPopup openModal={openAddVatModal} _finally={refetchVats} />
      <AddDiscountPopup
        openModal={openAddDiscountModal}
        _finally={refetchDiscounts}
      />

      <AddPaymentPopup
        openModal={openAddMethodModal}
        _finally={refetchMethods}
      />

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Discount'}
          defaultTitle={discount?.data?.name}
          options={discounts.map((d) => ({
            ...d,
            key: `${d.name} ${d?.value}${d?.type === 'percentage' ? '%' : ''}`,
          }))}
          titleKey="key"
          onChange={discount.set}
        />
        <IconButton onClick={openAddDiscountModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Vat'}
          defaultTitle={vat.data?.name}
          options={vats?.map((d) => ({
            ...d,
            key: `${d.name} ${d?.value}${d?.type === 'percentage' ? '%' : ''}`,
          }))}
          titleKey="key"
          onChange={vat.set}
        />

        <IconButton onClick={openAddVatModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Payment Method'}
          defaultTitle={paymentMethod?.data?.name}
          options={paymentMethods}
          titleKey="name"
          onChange={paymentMethod.set}
        />
        <IconButton onClick={openAddMethodModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <MuiTextField
          value={paid.value}
          onChange={paid.changeOnlyNumber}
          label="Paid Now"
        />
      </div>

      <div className="col-span-full flex items-center justify-end gap-2">
        <MuiConfirmationDialog
          showModal={showClearConfirmation}
          warningText={'Want to clear all POS data ? '}
          onConfirm={() => {
            onClearPOS();
            showClearConfirmation.setFalse();
          }}
          confirmButtonText={'Yes, Clear All'}
        />

        <Button
          onClick={showClearConfirmation.setTrue}
          variant="contained"
          color="error"
        >
          Clear All
        </Button>
        <Button onClick={handleCreateSale} variant="contained" color="primary">
          Create Sale & Invoice
          {invoiceCreating.true ? (
            <CircularProgress color="inherit" size={20} className="ml-2" />
          ) : null}
        </Button>
      </div>
    </div>
  );
}
