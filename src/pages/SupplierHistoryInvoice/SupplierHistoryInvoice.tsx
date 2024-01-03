import { TableCell, TableRow } from '@mui/material';
import BasicTable from '../../common/MaterialUi/Table/BasicTable';
import SupplierHistoryInvoiceHeader from './SupplierHistoryInvoiceHeader';
import SupplierHistoryInvoiceFooter from './SupplierHistoryInvoiceFooter';
import { uid } from 'uid';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SupplierHistoryT } from '../../data';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';

export default function SupplierHistoryInvoice() {
  const axios = useAxiosPrivate();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState({} as SupplierHistoryT);

  useEffect(() => {
    const id = params.get('id');
    if (!id) return navigate('/suppliers');

    (async () => {
      const { data } = await axios.get<SupplierHistoryT>(
        `/supplier-history/${id}`
      );
      if (!data?.id) return navigate('/suppliers');
      setHistory(data || {});
    })();
  }, [params]);

  return (
    <div className="print_area mx-auto w-full rounded bg-white p-6 shadow-sm xl:max-w-screen-md">
      <SupplierHistoryInvoiceHeader history={history} />

      {/* Tables */}
      <div className="custom_muitable_shadow space-y-2 pb-4 pt-2">
        <BasicTable>
          <TableRow>
            <TableCell>
              <b>Description</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>Quantity</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>Unit Price</b>
            </TableCell>
            <TableCell className="border-default border-l">
              <b>TOTAL</b>
            </TableCell>
          </TableRow>

          <TableRow key={uid()}>
            <TableCell>
              <div className=" max-w-[150px]"> {history?.product?.name} </div>
            </TableCell>
            <TableCell className="border-default border-l">
              {history?.quantity}
            </TableCell>
            <TableCell className="border-default border-l">
              {history?.product?.purchase_price}
            </TableCell>

            <TableCell className="border-default border-l">
              {history?.total_purchase_amount}
            </TableCell>
          </TableRow>
        </BasicTable>
        <br />
        <table className="w-full text-black">
          <tbody>
            <tr>
              <td className="p-1">
                <b className="text-sm capitalize"> Sub Total </b>
              </td>
              <td className="p-1 text-center"> = </td>
              <td className="p-1 text-right font-medium tracking-wider">
                {history?.total_purchase_amount}
              </td>
            </tr>
            <tr className="border-b border-gray-400">
              <td className="p-1">
                <b className="text-sm capitalize"> Discount </b>
              </td>
              <td className="p-1 text-center"> = </td>
              <td className="p-1 text-right font-medium tracking-wider">0</td>
            </tr>
            <tr>
              <td className="p-1">
                <b className="text-sm capitalize"> Total </b>
              </td>
              <td className="p-1 text-center"> = </td>
              <td className="p-1 text-right font-medium tracking-wider">
                {history?.total_purchase_amount}
              </td>
            </tr>
            <tr className="border-b border-gray-400">
              <td className="p-1">
                <b className="text-sm capitalize"> Paid </b>
              </td>
              <td className="p-1 text-center"> = </td>
              <td className="p-1 text-right font-medium tracking-wider">
                {history?.paid_amount}
              </td>
            </tr>
            <tr>
              <td className="p-1">
                <b className="text-sm capitalize"> Due </b>
              </td>
              <td className="p-1 text-center"> = </td>
              <td className="p-1 text-right font-medium tracking-wider">
                {history?.due_amount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <SupplierHistoryInvoiceFooter history={history} />
    </div>
  );
}
