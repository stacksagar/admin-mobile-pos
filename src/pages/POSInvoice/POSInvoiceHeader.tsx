import { usePOS } from '../../context/pos/pos';
import { useSetting } from '../../context/setting';
import { showDate } from '../../utils/date';

export default function POSInvoiceHeader() {
  const { setting } = useSetting();
  const { customer, invoice_id } = usePOS();

  return (
    <div className="text-center">
      <table className="w-full">
        <tbody>
          <tr>
            <td colSpan={4}>
              <div className="w-full">
                <img
                  className="mx-auto mr-5 max-h-[128px] max-w-[128px] object-cover object-center"
                  src={setting?.client?.invoice_logo}
                  alt=""
                />
              </div>
            </td>
            <td colSpan={8}>
              <div className="w-full text-left">
                <p className="pt-6 text-2xl">
                  <b> {setting?.client?.invoice_title} </b>
                </p>
                <h2> {setting?.client?.invoice_address}</h2>
                <p> {setting?.client?.invoice_phone}</p>
                <p>
                  <a
                    className="text-blue-500"
                    href={`mailto:${setting?.client?.invoice_email}`}
                  >
                    {setting?.client?.invoice_email}
                  </a>
                </p>
                <p className="pb-4">
                  <a
                    className="text-blue-600"
                    target="_blank"
                    href={setting?.client?.invoice_website}
                  >
                    {setting?.client?.invoice_website}
                  </a>
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p className="mb-2 pt-6 text-center text-xl font-semibold text-blue-500">
        Invoice Bill
      </p>
      <div className="border-default flex justify-between overflow-auto rounded border">
        <div className="flex w-full flex-col items-start p-4">
          <div className="flex items-center gap-x-2">
            <b> Name:</b>
            <p> {customer?.data?.name} </p>
          </div>

          <div className="flex items-center gap-x-2 ">
            <b> Address:</b>
            <p> {customer?.data?.address} </p>
          </div>

          <div className="flex items-center gap-x-2">
            <b> Phone:</b>
            <p> {customer?.data?.phone} </p>
          </div>
          <div className="flex items-center gap-x-2">
            <b> Email:</b>
            <p> {customer?.data?.email} </p>
          </div>
        </div>

        <div className="border-default flex w-full flex-col border-l p-4">
          <div className="flex items-center gap-x-2 whitespace-nowrap">
            <b>Invoice ID:</b>
            <p> {invoice_id?.value || Math.floor(Math.random() * 99999)} </p>
          </div>

          <div className="flex items-center gap-x-2 whitespace-nowrap">
            <b>Date:</b>
            <p> {showDate(new Date().toString(), true)} </p>
          </div>
          <div className="flex items-center gap-x-2 whitespace-nowrap">
            <b>Time:</b>
            <p> {new Date()?.toLocaleTimeString()} </p>
          </div>
        </div>
      </div>
    </div>
  );
}
