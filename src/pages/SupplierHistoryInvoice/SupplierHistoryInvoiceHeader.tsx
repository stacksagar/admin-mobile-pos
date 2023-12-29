import { SupplierHistoryT } from '../../data';
import { showDate } from '../../utils/date';

interface PropsT {
  history: SupplierHistoryT;
}

export default function SupplierHistoryInvoiceHeader({ history }: PropsT) {
  return (
    <div className="text-center">
      <p className="mb-2 pt-6 text-center text-xl font-semibold text-blue-500">
        Purchase Invoice
      </p>
      <div className="border-default flex justify-between overflow-auto rounded border">
        <div className="flex w-full flex-col items-start p-4">
          <div className="flex items-center gap-x-2">
            <b> Supplier Name:</b>
            <p> {history?.supplier?.supplier_name} </p>
          </div>

          <div className="flex items-center gap-x-2 ">
            <b>Supplier Address:</b>
            <p> {history?.supplier?.address} </p>
          </div>

          <div className="flex items-center gap-x-2">
            <b> Supplier Phone:</b>
            <p> {history?.supplier?.phone} </p>
          </div>
          <div className="flex items-center gap-x-2">
            <b> Supplier Email:</b>
            <p> {history?.supplier?.email} </p>
          </div>
        </div>

        <div className="border-default flex w-full flex-col border-l p-4">
          <div className="flex items-center gap-x-2 whitespace-nowrap">
            <b> Purchased By:</b>
            <p> {history?.user?.name} </p>
          </div>
          <div className="flex items-center gap-x-2 whitespace-nowrap">
            <b> Invoice ID:</b>
            <p> {history?.id} </p>
          </div>

          <div className="flex items-center gap-x-2 whitespace-nowrap">
            <b>Purchase Date:</b>
            <p> {showDate(history?.createdAt)} </p>
          </div>

          <div className="flex items-center gap-x-2 whitespace-nowrap">
            <b>Issue Date:</b>
            <p> {showDate(new Date().toString())} </p>
          </div>
        </div>
      </div>
    </div>
  );
}
