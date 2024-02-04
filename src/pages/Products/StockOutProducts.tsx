import useBoolean from '../../hooks/state/useBoolean';
import toast_async from '../../utils/toast_async';
import { axios_private } from '../../api/api';
import Breadcrumb from '../../components/Breadcrumb';
import MuiTable from '../../common/MaterialUi/Table/MuiTable';
import productsTableCells from './productsTableCells';
import useString from '../../hooks/state/useString';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import filterItems from '../../utils/filterItems';
import useStockOutProducts from '../../hooks/react-query/useStockOutProducts';

export default function Users() {
  const deleting = useBoolean();

  const { products, refetchProducts, fetchingProducts } = useStockOutProducts();

  async function onMultipleDelete(ids: ID[]) {
    deleting.setTrue();

    try {
      await toast_async<any>(
        axios_private.delete('/product/multiple', { data: { ids } }),
        {
          start: 'Deleting.. wait a moment!',
          success: `Successfully deleted ${ids?.length} items!`,
          error: '',
        }
      );
    } finally {
      deleting.setFalse();
      refetchProducts();
    }
  }

  const searchTerm = useString('');

  return (
    <div>
      <Breadcrumb pageName="Products" />
      <br />

      <div className="max-w-full overflow-hidden">
        <div className="bg-white p-2">
          <MuiTextField
            label="Search Products"
            value={searchTerm.value}
            onChange={searchTerm.change}
          />
        </div>
        <MuiTable
          onRefreshData={refetchProducts}
          onDelete={onMultipleDelete}
          tableCells={productsTableCells}
          rows={filterItems(products || [], searchTerm.value) || []}
          loading={fetchingProducts}
          tableTitle="StockOut Products"
          deleting={deleting}
        />
      </div>
    </div>
  );
}
