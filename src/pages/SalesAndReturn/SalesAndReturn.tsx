import { useAppDispatch, useAppSelector } from '../../app/store';
import MaterialTableServer from '../../common/MaterialUi/Table/MaterialTableServer';
import { fetchSales } from '../../app/features/sales/requests';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import useTableSelectAll from '../../hooks/table/useTableSelectAll';
import useFetchWithPagination from '../../hooks/redux/useFetchWithPagination';
import Breadcrumb from '../../components/Breadcrumb';
import useBoolean from '../../hooks/state/useBoolean';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { axios_private } from '../../api/api';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import { removeSale, removeSales } from '../../app/features/sales/salesSlice';
import { useState } from 'react';
import { showDate } from '../../utils/date';
import { usePOSData } from '../../context/pos';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { updateProduct } from '../../app/features/products/stockInProductsSlice';
import makeToSerialize from '../../utils/makeToSerialize';

export default function Sales() {
  const axios = useAxiosPrivate();
  const { setSaleDataToPOS } = usePOSData();
  const dispatch = useAppDispatch();
  const {
    data: sales,
    limit,
    currentPage,
    totalItems,
    totalPages,
    loading,
  } = useAppSelector((s) => s.sales);

  const { changePage } = useFetchWithPagination({
    data: [],
    fetchFunc: fetchSales,
  });

  const { selectedIds, onChangeSelected } = useTableSelectAll();
  const [selectedID, setSelectedID] = useState<any>();

  const showSelectedDeletePopup = useBoolean();
  const selectedDeleting = useBoolean();

  async function deleteMultipleItems() {
    selectedDeleting.setTrue();
    try {
      await axios_private.delete('/sale/delete-multiples', {
        data: { ids: selectedID || selectedIds },
      });

      selectedID
        ? dispatch(removeSale(selectedID))
        : dispatch(removeSales(selectedIds));

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

  const [sale, setSale] = useState({} as Sale);
  const refunding = useBoolean();
  const showRefundPopup = useBoolean();
  async function handleRefund() {
    try {
      const { data: getData } = await axios.get(
        `/product/${sale?.product?.id}`
      );
      const product: Product = getData?.product;
      if (!product) return;

      const { data: putData } = await axios.put(
        `/product/${sale?.product?.id}`,
        {
          total_sale: (product?.total_sale || 0) - sale?.product?.quantity,
          in_stock: (product?.in_stock || 0) + sale?.product?.quantity,
        }
      );
      putData?.product && dispatch(updateProduct(putData?.product));

      await axios.delete(`/sale/${sale?.id}`);

      dispatch(removeSale(sale?.id));
      toast({
        message: 'Refund successfull!',
      });
    } catch (error) {
      toast({
        type: 'error',
        message: error_message(error),
      });
    } finally {
      showRefundPopup.setFalse();
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
    {
      field: 'name',
      headerName: 'Name',
      width: 120,
      renderCell(params) {
        return (
          <div>
            <div>{params?.row?.customer?.name || params?.row?.name}</div>
            <div>{params?.row?.customer?.phone || params?.row?.phone}</div>
          </div>
        );
      },
    },

    {
      field: 'product_name',
      headerName: 'Product Name',
      width: 160,
      renderCell(params) {
        return <div> {params?.row?.product?.name} </div>;
      },
    },

    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 80,
      renderCell(params) {
        return <div> {params?.row?.product?.quantity} </div>;
      },
    },

    {
      field: 'total_price',
      headerName: 'Total Price',
      width: 200,
      renderCell(params) {
        return (
          <div>
            <div> Price: {params?.row?.product?.sale_price} </div>
            <div>Total Price: {params?.row?.product?.total_price}</div>
          </div>
        );
      },
    },
    {
      field: 'invoice_id',
      headerName: 'Invoice ID',
      width: 120,
      renderCell(params) {
        return <div> {params?.row?.invoiceID} </div>;
      },
    },
    {
      field: 'warranty',
      headerName: 'Warranty',
      width: 110,
      renderCell(params) {
        return <div> {params?.row?.warranty?.name} </div>;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      width: 250,

      renderCell(params) {
        return (
          <div className="flex items-center gap-1">
            <Link to="/pos_invoice">
              <Button
                title="View Invoice"
                variant="contained"
                size="small"
                onClick={() => {
                  setSaleDataToPOS(params.row);
                }}
              >
                Invoice
              </Button>
            </Link>

            <Button
              title="Refund"
              variant="contained"
              size="small"
              color="warning"
              onClick={() => {
                if (typeof params?.row?.product === 'string') {
                  const row = {
                    ...params.row,
                    product: JSON.parse(params?.row?.product),
                  };
                  setSale(row);
                } else {
                  setSale(params.row);
                }
                showRefundPopup.setTrue();
              }}
            >
              Refund
            </Button>

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
      <Breadcrumb pageName="Sales and Return" />

      <MuiConfirmationDialog
        loading={selectedDeleting.true}
        showModal={showSelectedDeletePopup}
        warningText={
          selectedID
            ? 'Want to delete sale?'
            : `Want to delete all selected '${selectedIds?.length}' sales?`
        }
        onConfirm={deleteMultipleItems}
        confirmButtonText={selectedID ? 'Delete' : 'Delete All'}
      />

      <MuiConfirmationDialog
        loading={refunding.true}
        showModal={showRefundPopup}
        onConfirm={handleRefund}
        warningText={`Want to refund ${sale?.product?.name} ? `}
        confirmButtonText="Refund"
      />

      <MaterialTableServer
        // -- data
        data={makeToSerialize(sales, currentPage, limit)}
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
        // addNewText={'Add New Sale'}
        // addNewHandler={() => {
        //   showAddSalePopup.setTrue();
        // }}
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
