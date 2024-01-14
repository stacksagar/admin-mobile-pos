import { Button } from '@mui/material';
import FIcon from '../../common/Icons/FIcon';
import { Link, useNavigate } from 'react-router-dom';
import { usePOS } from '../../context/pos/pos';
import { useSetting } from '../../context/setting';

export default function POSInvoiceFooter({}) {
  const navigate = useNavigate();
  const { setting } = useSetting();
  const { customer, onClearPOS } = usePOS();

  function printHandler() {
    document.title = `invoice-${customer?.data?.name || 'customer '}`;
    window.print();
    document.title = 'Mobile SHOP Management';
  }

  return (
    <div>
      <div className="flex justify-start gap-2">
        <div>
          <div className="min-h-[60px]">
            {setting?.client?.invoice_sign ? (
              <img
                title="image"
                className="w-32 bg-[#0000000a]"
                src={setting?.client?.invoice_sign}
              />
            ) : null}
          </div>

          <p className="text-lg">
            <i>Signature</i>
          </p>
        </div>
      </div>
      <div className="hide_print flex justify-end gap-2">
        <Link to={`/pos`}>
          <Button
            onClick={() => {
              onClearPOS();
              navigate(-1);
            }}
            variant="contained"
            color="success"
          >
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
