import { TaxT } from '../../data';
import { showDate } from '../../utils/date';

export default function taxTableCells() {
  const cells: MuiTableHeader<TaxT>[] = [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'createdAt',
      label: 'Date',
      RenderComponent({ row }) {
        return <p> {showDate(row?.createdAt, true)} </p>;
      },
    },
    {
      key: 'name',
    },

    {
      key: 'description',
    },

    {
      key: 'actions',
    },
  ];
  return cells;
}
