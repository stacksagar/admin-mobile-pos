import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import warrantyTableCells from './warrantyTableCells';
import useObject from '../../hooks/state/useObject';
import { Button } from '@mui/material';
import useWarranties from '../../hooks/react-query/useWarranties';
import { Link } from 'react-router-dom';
import { WarrantyT } from '../../data';

export default function Warranties() {
  const axios = useAxiosPrivate();

  const { warranties, fetchingWarranties, refetchWarranties } = useWarranties();

  const deleting = useBoolean();
  const selectedItem = useObject({} as WarrantyT);

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();
    try {
      await toast_async<any>(
        axios.delete('/warranty/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchWarranties();
    }
  }

  return (
    <div>
      <br />

      <Breadcrumb pageName="Warranties" />

      <div className="max-w-full overflow-hidden">
        <MuiTable
          onRefreshData={refetchWarranties}
          onDelete={onMultipleDelete}
          tableCells={warrantyTableCells({
            onEditBtnClick(item) {
              selectedItem.set(item);
            },
          })}
          rows={warranties || []}
          loading={fetchingWarranties}
          tableTitle="Warranties"
          deleting={deleting}
          CustomButton={
            <Link to="/warranty-pos">
              <Button variant="contained">Add Warranty</Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
