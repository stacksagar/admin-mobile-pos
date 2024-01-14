import MaterialTableServer from '../../common/MaterialUi/Table/MaterialTableServer';
import { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import useTableSelectAll from '../../hooks/table/useTableSelectAll';
import Breadcrumb from '../../components/Breadcrumb';
import useBoolean from '../../hooks/state/useBoolean';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { axios_private } from '../../api/api';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import { useState } from 'react';
import { showDate } from '../../utils/date';
import { Link } from 'react-router-dom';
import useSales from '../../hooks/react-query/useSales';
import { SaleT, UserT } from '../../data';
import { usePOS } from '../../context/pos/pos';
import { POSProductT } from '../../context/pos/POSContext';

export default function Sales() {
  const { sales, refetchSales, fetchingSales } = useSales();

  const { selectedIds, onChangeSelected } = useTableSelectAll();
  const [selectedID, setSelectedID] = useState<any>();

  const {
    customer,
    vat_amount,
    discount_amount,
    payable_amount,
    products,
    paid,
  } = usePOS();

  const showSelectedDeletePopup = useBoolean();
  const selectedDeleting = useBoolean();

  async function deleteMultipleItems() {
    selectedDeleting.setTrue();

    try {
      await axios_private.delete('/sale/delete-multiples', {
        data: { ids: selectedID || selectedIds },
      });

      toast({ message: 'Successfully Deleted!' });
    } catch (error) {
      toast({
        message: error_message(error),
      });
    } finally {
      showSelectedDeletePopup.setFalse();
      selectedDeleting.setFalse();
      refetchSales();
    }
  }

  const [sale, setSale] = useState({} as SaleT);
  const refunding = useBoolean();
  const showRefundPopup = useBoolean();
  async function handleRefund() {
    try {
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

  function handleInvoice(sale: SaleT) {
    customer.set(sale.customer as UserT);
    vat_amount.set(sale.vat);
    discount_amount.set(sale.discount);
    payable_amount.set(sale.total);
    paid.setCustom(sale.paid?.toString());
    products.add({
      ...sale.product,
      price: sale?.product?.sale_price,
      quantity: sale?.quantity,
      total_price: sale?.total,
    } as POSProductT);
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
      field: 'total',
      headerName: 'Total Price',
      width: 110,
      renderCell(params) {
        return <div> {params?.row?.total} </div>;
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
                onClick={() => handleInvoice(params?.row)}
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
        data={sales}
        filterKeys={['name', 'email']}
        columns={columns}
        onChangeSelected={onChangeSelected}
        // -- pagination options
        totalItems={0}
        totalPages={0}
        currentPage={0}
        changePage={() => {}}
        limit={0}
        loading={fetchingSales}
        multipleDeleteHandler={() => {
          setSelectedID(null);
          showSelectedDeletePopup.setTrue();
        }}
        showMultipleDeleteHandler={selectedIds.length > 0}
      />
    </div>
  );
}
