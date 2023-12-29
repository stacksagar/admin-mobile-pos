import { Button } from '@mui/material';
import FIcon from '../../common/Icons/FIcon';
import { Link } from 'react-router-dom';
import { SupplierHistoryT } from '../../data';

interface PropsT {
  history: SupplierHistoryT;
}

export default function SupplierHistoryInvoiceHeader({ history }: PropsT) {
  function printHandler() {
    document.title = `supplier-history-${history?.id}`;
    window.print();
    document.title = 'Mobile SHOP Management';
  }

  return (
    <div>
      <div className="hide_print flex justify-end gap-2">
        <Link to={`/supplier-purchase-history`}>
          <Button variant="contained" color="success">
            <FIcon icon="backpack" />
            Back
          </Button>
        </Link>

        <Button
          variant="contained"
          onClick={printHandler}
          className="btn-primary space-x-1"
        >
          <FIcon icon="print" />
          <span>Print</span>
        </Button>
      </div>
    </div>
  );
}
