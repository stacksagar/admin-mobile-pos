import useBoolean, { UseBoolean } from '../../hooks/state/useBoolean';
import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useString from '../../hooks/state/useString';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { SupplierHistoryT } from '../../data';
import toast from '../../libs/toast';

interface Props {
  openModal: UseBoolean;
  history: SupplierHistoryT;
  _finally?: () => void;
}

export default function PaidSupplierPopup({
  openModal,
  history,
  _finally,
}: Props) {
  const submitting = useBoolean();
  const amount = useString('');

  const axios = useAxiosPrivate();

  async function submitHandler() {
    try {
      const payableData = {
        supplierId: history?.supplierId,
        description: `Payment has been made to '${history?.supplier?.supplier_name}' for the due purchase of the '${history?.product?.name}'.`,
        paid_amount: Number(amount.value || '0'),
      };

      if (Number(amount.value || '0') === 0) return;

      if (Number(amount.value || '0') > history?.due_amount) {
        toast({
          message: `Your amount is large then due`,
          type: 'warning',
        });
        return;
      }

      axios.post(`/payment-history`, payableData);
      axios.put(`/supplier-history/${history?.id}`, {
        paid_amount: history.paid_amount + Number(amount.value || '0'),
        due_amount: history.due_amount - Number(amount.value || '0'),
      });

      toast({
        message: `Successfully paid to ${history?.supplier?.supplier_name}.`,
      });
    } catch (error) {
      console.log('ERROR ', error);
    } finally {
      openModal.setFalse();
      _finally && _finally();
    }
  }

  return (
    <MuiResponsiveDialog
      handleSubmit={submitHandler}
      title={`Submit`}
      openModal={openModal}
      loading={submitting.true}
    >
      <MuiTextField label="Amount" onChange={amount.changeOnlyNumber} />
    </MuiResponsiveDialog>
  );
}
