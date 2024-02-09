import { PaymentHistoryT } from '../../data';
import { showDate } from '../../utils/date';

export default function paymentHistoriesTableCells() {
  const cells: MuiTableHeader<PaymentHistoryT>[] = [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'createdAt',
      label: 'Date',
      RenderComponent({ row }) {
        return (
          <div>
            <p> {showDate(row?.createdAt, true)} </p>
            <p>
              {row?.createdAt && new Date(row?.createdAt)?.toLocaleTimeString()}
            </p>
          </div>
        );
      },
    },

    { key: 'paid_amount', label: 'Paid Amount' },

    {
      key: 'supplier',
      RenderComponent({ row }) {
        return row?.user?.id ? (
          <div>
            <p> {row?.user?.name} </p>
          </div>
        ) : (
          <div>
            <p> {row?.supplier?.supplier_name} </p>
          </div>
        );
      },
    },

    {
      key: 'description',
      RenderComponent({ row }) {
        return (
          <p className="max-w-[300px] whitespace-break-spaces">
            {row?.description}
          </p>
        );
      },
    },

    {
      key: 'actions',
    },
  ];
  return cells;
}
