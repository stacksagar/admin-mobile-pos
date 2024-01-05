import { Button } from '@mui/material';
import { BarcodeT } from '../../data';
import FIcon from '../../common/Icons/FIcon';
import useBoolean from '../../hooks/state/useBoolean';
import MuiContentModal from '../../common/MaterialUi/Modal/MuiContentModal';
import ViewBarcodes from './ViewBarcodes';
import BarcodePrintButton from './BarcodePrintButton';

const supplierHistoriesTableCells: MuiTableHeader<BarcodeT & { key: 'sl' }>[] =
  [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'productId',
      label: 'Product',
      RenderComponent({ row }) {
        return (
          <div>
            <h6 className="max-w-[140px] whitespace-pre-line break-words text-lg font-medium">
              {row?.product?.name}
            </h6>
          </div>
        );
      },
    },
    {
      key: 'quantity',
    },

    {
      key: 'barcode',
    },

    {
      key: 'actions',
      ActionButtons({ row }) {
        const showView = useBoolean();
        return (
          <>
            <MuiContentModal
              openModal={showView}
              SubmitButton={
                <BarcodePrintButton
                  item={row}
                  startTitle={row?.product?.name}
                  quantity={row.quantity}
                />
              }
            >
              <ViewBarcodes item={row} />
            </MuiContentModal>
            <Button
              onClick={showView.toggle}
              variant="contained"
              title="Edit"
              size="small"
              color="success"
            >
              <FIcon icon="eye" />
              <span className="pl-2">View</span>
            </Button>
          </>
        );
      },
    },
  ];

export default supplierHistoriesTableCells;
