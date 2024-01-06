import { Button, CircularProgress, IconButton } from '@mui/material';
import useBoolean from '../../hooks/state/useBoolean';
import AddPaymentPopup from '../Payments/AddPaymentPopup';
import AddDiscountPopup from '../Discounts/AddDiscountPopup';
import AddVatPopup from '../Vats/AddVatPopup';
import MuiSelect from '../../common/MaterialUi/Forms/MuiSelect';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import FIcon from '../../common/Icons/FIcon';

export default function PosFooter() {
  const invoiceCreating = useBoolean();
  const openAddDiscountModal = useBoolean();
  const openAddVatModal = useBoolean();
  const openAddMethodModal = useBoolean();
  const showClearConfirmation = useBoolean();
  async function handleCreateInvoice() {}

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      <AddDiscountPopup openModal={openAddDiscountModal} />
      <AddVatPopup openModal={openAddVatModal} />
      <AddPaymentPopup openModal={openAddMethodModal} />

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Discount'}
          defaultTitle={null}
          options={[]}
          titleKey="name"
          onChange={console.log}
        />
        <IconButton onClick={openAddDiscountModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Vat'}
          defaultTitle={null}
          options={[]}
          titleKey="name"
          onChange={console.log}
        />

        <IconButton onClick={openAddVatModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center sm:pt-1">
        <MuiTextField label="Pay Today" type="number" />
      </div>

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Payment Method'}
          defaultTitle={null}
          options={[]}
          titleKey="name"
          onChange={console.log}
        />
        <IconButton onClick={openAddMethodModal.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center sm:pt-1">
        <MuiSelect
          label="Status"
          value={''}
          onChange={console.log}
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
          onConfirm={console.log}
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
