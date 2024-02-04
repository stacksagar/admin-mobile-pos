import { useAppDispatch, useAppSelector } from '../../app/store';
import MaterialTableServer from '../../common/MaterialUi/Table/MaterialTableServer';
import { fetchStockOutProducts } from '../../app/features/products/requests';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import useTableSelectAll from '../../hooks/table/useTableSelectAll';
import useFetchWithPagination from '../../hooks/redux/useFetchWithPagination';
import Breadcrumb from '../../components/Breadcrumb';
import useBoolean from '../../hooks/state/useBoolean';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import {
  removeProduct,
  removeProducts,
} from '../../app/features/products/stockOutProductsSlice';
import { useState } from 'react';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { Link } from 'react-router-dom';
import { showDate } from '../../utils/date';
import makeToSerialize from '../../utils/makeToSerialize';

export default function StockOutProducts() {
  const axios = useAxiosPrivate();
  const appDispatch = useAppDispatch();
  const {
    data: products,
    limit,
    currentPage,
    totalItems,
    totalPages,
    loading,
  } = useAppSelector((s) => s.stock_out_products);

  const { changePage } = useFetchWithPagination({
    data: products,
    fetchFunc: fetchStockOutProducts,
  });

  const { selectedIds, onChangeSelected } = useTableSelectAll();
  const [selectedID, setSelectedID] = useState<any>();

  const showSelectedDeletePopup = useBoolean();
  const selectedDeleting = useBoolean();
  async function deleteMultipleItems() {
    selectedDeleting.setTrue();
    try {
      await axios.delete('/product/delete-multiples', {
        data: { ids: selectedID || selectedIds },
      });

      selectedID
        ? appDispatch(removeProduct(selectedID))
        : appDispatch(removeProducts(selectedIds));

      toast({ message: 'Successfully Deleted!' });
    } catch (error) {
      toast({
        message: error_message(error),
      });
    } finally {
      showSelectedDeletePopup.setFalse();
      selectedDeleting.setFalse();
    }
  }

  const columns: GridColDef[] = [
    { field: 'sl', headerName: 'SL', width: 10 },

    {
      field: 'createdAt',
      headerName: 'Date',
      renderCell(params) {
        return <div> {showDate(params.row?.createdAt, true)} </div>;
      },
    },

    { field: 'name', headerName: 'Name', width: 130 },

    {
      field: 'price',
      headerName: 'Price',
      width: 200,
      renderCell(params) {
        return (
          <div>
            <div> Purchase: ৳{params?.row?.purchase_price} </div>
            <div> Sell: ৳{params?.row?.sale_price} </div>
          </div>
        );
      },
    },

    { field: 'barcode', headerName: 'Barcode', width: 90 },
    {
      field: 'sizes',
      headerName: 'Sizes',
      width: 200,
      renderCell(params) {
        return (
          <div className="flex flex-wrap gap-2">
            {Object.entries(params?.row?.sizes || {})?.map(
              ([key, value]: any) => (
                <div
                  key={key}
                  className="flex rounded bg-[#0000000e] px-1 dark:bg-[#ffffff0e]"
                >
                  {key} {value}
                </div>
              )
            )}
          </div>
        );
      },
    },
    {
      field: 'colors',
      headerName: 'Colors',
      width: 200,
      hideable: true,

      renderCell(params) {
        return (
          <div className="flex flex-wrap gap-1">
            {Object.entries(params?.row?.colors || {})?.map(
              ([key, value]: any) => (
                <div
                  key={key}
                  className="flex rounded bg-[#0000000e] px-1 dark:bg-[#ffffff0e]"
                >
                  {key} {value}
                </div>
              )
            )}
          </div>
        );
      },
    },

    { field: 'in_stock', headerName: 'In Stock', width: 70 },
    { field: 'total_sale', headerName: 'Total Sales', width: 90 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 220,

      renderCell(params) {
        return (
          <div className="flex items-center gap-1">
            <Link to={`/edit-product?id=${params.id}`}>
              <Button variant="contained" title="Edit" size="small">
                Edit
              </Button>
            </Link>
            <Button
              title="Delete"
              variant="contained"
              size="small"
              color="error"
              onClick={() => {
                setSelectedID(params?.id || '');
                showSelectedDeletePopup.setTrue();
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Breadcrumb pageName="Stock Out Products" />

      <MuiConfirmationDialog
        loading={selectedDeleting.true}
        showModal={showSelectedDeletePopup}
        warningText={
          selectedID
            ? 'Want to delete product?'
            : `Want to delete all selected '${selectedIds?.length}' products?`
        }
        onConfirm={deleteMultipleItems}
        confirmButtonText={selectedID ? 'Delete' : 'Delete All'}
      />

      <MaterialTableServer
        // -- data
        data={makeToSerialize(products, currentPage, limit)}
        filterKeys={['name', 'email']}
        columns={columns}
        onChangeSelected={onChangeSelected}
        // -- pagination options
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        changePage={changePage}
        limit={limit}
        loading={loading}
        // -- buttons/handlers
        // addNewText={'Buy Product'}
        // addNewLink="/add-product"
        // addNewHandler={() => {}}
        // filterHandler={() => {}}
        // downloadHandler={() => {}}

        multipleDeleteHandler={() => {
          setSelectedID(null);
          showSelectedDeletePopup.setTrue();
        }}
        showMultipleDeleteHandler={selectedIds.length > 0}
      />
    </div>
  );
}
