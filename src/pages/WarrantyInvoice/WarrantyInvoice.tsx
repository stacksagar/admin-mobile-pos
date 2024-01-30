import { Button, TableCell, TableRow } from '@mui/material';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import POSInvoiceHeader from './WarrantyInvoiceHeader';
import { useSetting } from '../../context/setting';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import FIcon from '../../common/Icons/FIcon';
import useObject from '../../hooks/state/useObject';
import { WarrantyT } from '../../data';
import { useEffect } from 'react';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { showDate } from '../../utils/date';

export default function POSInvoice() {
  const [params] = useSearchParams();
  const warranty = useObject({} as WarrantyT);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const { setting } = useSetting();

  function printHandler() {
    document.title = `warranty-invoice-${
      warranty?.data?.customer?.name || 'customer '
    }`;
    window.print();
    document.title = 'Mobile SHOP Management';
  }

  useEffect(() => {
    const id = params.get('id');
    if (!id) return;

    (async () => {
      const { data } = await axios.get<WarrantyT>(`/warranty/${id}`);
      if (!data?.id) return;
      warranty.set(data);
    })();
  }, [params]);

  return (
    <div className="print_area mx-auto w-full rounded bg-white p-6 shadow-sm xl:max-w-screen-md">
      <POSInvoiceHeader warranty={warranty?.data} />

      {/* Tables */}
      <div className="custom_muitable_shadow space-y-2 pb-4 pt-2">
        <BasicTable>
          <TableRow>
            <TableCell>
              <b>Product</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>Brand</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>Category</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>Receive Date</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>Delivery Date</b>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <div className=" max-w-[150px]">
                {warranty?.data?.product?.name}
              </div>
            </TableCell>

            <TableCell className="border-default border-l">
              {warranty?.data?.category?.name}
            </TableCell>
            <TableCell className="border-default border-l">
              {warranty?.data?.brand?.name}
            </TableCell>

            <TableCell className="border-default border-l">
              {showDate(warranty?.data?.receive_date, true)}
            </TableCell>

            <TableCell className="border-default border-l">
              {showDate(warranty?.data?.delivery_date, true)}
            </TableCell>
          </TableRow>
        </BasicTable>
        <BasicTable size="small">
          <TableRow>
            <TableCell> Delivery Fee </TableCell>
            <TableCell> = </TableCell>
            <TableCell>{warranty?.data?.delivery_fee}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Warranty Fee </TableCell>
            <TableCell> = </TableCell>
            <TableCell>{warranty?.data?.warranty_fee}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Total Fee </TableCell>
            <TableCell> = </TableCell>
            <TableCell>
              {warranty?.data?.delivery_fee + warranty?.data?.warranty_fee}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Advance </TableCell>
            <TableCell> = </TableCell>
            <TableCell>{warranty?.data?.advance_amount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell> Due </TableCell>
            <TableCell> = </TableCell>
            <TableCell>{warranty?.data?.due_amount}</TableCell>
          </TableRow>
        </BasicTable>
      </div>

      {/* Footer */}
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
    </div>
  );
}
