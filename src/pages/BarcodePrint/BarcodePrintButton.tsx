import { BarcodeT } from '../../data';
import FIcon from '../../common/Icons/FIcon';
import { Button } from '@mui/material';
import { uid } from 'uid';

interface PropsT {
  item: BarcodeT;
  size?: 'large' | 'medium' | 'small';
  quantity?: number;
  startTitle?: string;
}

export default function BarcodePrintButton({
  size,
  quantity,
  startTitle,
}: PropsT) {
  function printHandler() {
    document.title = `${startTitle || uid(6)}-barcodes(${quantity})`;
    window.print();
    document.title = 'Mobile SHOP Management';
  }

  return (
    <Button onClick={printHandler} size={size} variant="contained">
      <FIcon icon="print" />
      <span className="pl-2">Print</span>
    </Button>
  );
}
