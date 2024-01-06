import { Button, SelectChangeEvent } from '@mui/material';
import ButtonWithCopy from '../../common/Buttons/ButtonWithCopy';
import useBoolean from '../../hooks/state/useBoolean';
import { useAppDispatch } from '../../app/store';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import { useState } from 'react';
import { axios_private } from '../../api/api';
import { updateOrder } from '../../app/features/orders/orderSlice';
import capitalize from '../../utils/capitalize';
import { uid } from 'uid';
import MuiSelect from '../../common/MaterialUi/Forms/MuiSelect';
import FIcon from '../../common/Icons/FIcon';
import { usePOSData } from '../../context/pos/pos';
import { Link } from 'react-router-dom';
import { addSale } from '../../app/features/sales/salesSlice';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';

const ordersTableCells: MuiTableHeader<Order>[] = [
  {
    key: 'sl',
    label: 'Order ID',
  },

  {
    key: 'name',
    label: 'User',
    RenderComponent({ row }) {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span> {row?.name} </span>
          </div>

          <div className="flex items-center gap-1">
            <a className="text-blue-500" href={`mailto:${row?.email}`}>
              <b>{row?.email}</b>
            </a>
            <ButtonWithCopy value={row?.email} />
          </div>

          <div className="flex items-center gap-1">
            <a className="text-blue-500" href={`tel:${row?.phone}`}>
              <b>{row?.phone}</b>
            </a>
            <ButtonWithCopy value={row?.phone} />
          </div>
        </div>
      );
    },
  },

  {
    key: 'address',
    label: 'Shipping Address',
    RenderComponent({ row }) {
      return (
        <div className="flex max-w-[160px] flex-col gap-2 truncate">
          <div> City: {row?.city} </div>
          <div className="max-w-[160px] overflow-auto break-words">
            {row?.address}
          </div>
          <div> Post/ZIP: {row?.postcode} </div>
        </div>
      );
    },
  },
  {
    key: 'products',
    RenderComponent({ row }) {
      return (
        <div className="flex flex-col gap-3">
          <p>{row?.products?.length} Items</p>
          {row.products?.map((p) => (
            <a
              key={p?.id + uid()}
              target="_blank"
              href={`/item/${p?.slug}`}
              className="flex max-w-[150px] items-center gap-1 truncate text-blue-500 hover:text-blue-600"
            >
              {p?.images ? (
                <img
                  className="max-h-[40px] max-w-[40px] rounded"
                  src={p?.images[0]}
                  alt=""
                />
              ) : null}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-black dark:text-white">
                  Quantity: {row?.quantitiesByProduct[p?.id]}
                </span>
                <span className="hover:underline">{p?.name}</span>
              </div>
            </a>
          ))}
        </div>
      );
    },
  },

  {
    key: 'total_price',
    label: 'Total Price',
    RenderComponent({ row }) {
      return <div> ৳{row?.total_price} </div>;
    },
  },

  {
    key: 'status',
    label: 'Status/Tracking',
    RenderComponent({ row }) {
      async function handleTracking(e: SelectChangeEvent<unknown>) {
        const tracking = e.target.value;
        axios_private.put(`/order?id=${row.id}`, { tracking });
      }

      return (
        <div>
          {row.status === 'processing' ? (
            <div className="flex w-fit items-center gap-1 rounded bg-orange-600 px-2 py-1 text-white">
              <FIcon icon="shopping-bag" /> <span>Processing...</span>
            </div>
          ) : row.status === 'canceled' ? (
            <div className="flex w-fit items-center gap-1 rounded bg-red-400 px-2 py-1 text-white">
              <FIcon icon="exclamation-circle" /> <span>Canceled</span>
            </div>
          ) : (
            <div className="flex w-fit items-center gap-1 rounded bg-green-600 px-2 py-1 text-white">
              <FIcon icon="check-square" /> <span>Delivered</span>
            </div>
          )}

          <br />

          <div>
            <h5>Tracking:</h5>
            <MuiSelect
              onChange={handleTracking}
              defaultValue={row.tracking}
              options={[
                { title: 'Delivered', value: 'delivered' },
                { title: 'Shipped', value: 'shipped' },
                { title: 'Processing', value: 'processing' },
                { title: 'Payment Pending', value: 'payment_pending' },
              ]}
            />
          </div>
        </div>
      );
    },
  },

  {
    key: 'payment_method',
    RenderComponent({ row }) {
      return (
        <div>
          <div className="flex flex-col gap-1">
            <p className="rounded bg-cyan-200 px-2 py-1 text-black">
              Pay via: <br />
              <b> {row?.payment_method} </b>
            </p>
            <p className="rounded bg-cyan-200 px-2 py-1 text-black">
              Payment/TrxID: <br /> <b> {row?.paymentID} </b>
            </p>
          </div>
        </div>
      );
    },
  },

  {
    key: 'actions',
    ActionButtons({ row }) {
      const axios = useAxiosPrivate();
      const { setSaleDataToPOS } = usePOSData();
      const dispatch = useAppDispatch();
      const [status, setStatus] = useState<OrderStatus>('' as OrderStatus);
      const banning = useBoolean();
      const showCancelWarning = useBoolean(false);
      async function statusHandler() {
        try {
          await axios_private.put(`/order?id=${row?.id}`, {
            status,
          });
          dispatch(
            updateOrder({
              id: row?.id,
              status,
            })
          );

          row?.products.forEach(async (product) => {
            const newSaleData = {
              product,
              name: row.user?.name,
              phone: row.user?.phone,
              invoiceID: uid(),
              payAmount: product.sale_price,
              saleAmount: product?.sale_price,
              purchaseAmount: product.purchase_price,
              status: 'success',
              discount: 0,
            };
            const { data: saleInfo } = await axios.post(`/sale`, newSaleData);
            saleInfo?.sale && dispatch(addSale(saleInfo?.sale));
          });
        } finally {
          banning.setFalse();
          showCancelWarning.setFalse();
        }
      }

      return (
        <>
          {row?.status === 'delivered' ? (
            <Link to="/pos_invoice">
              <Button
                onClick={() => {
                  const quantity = Object.values(
                    row.quantitiesByProduct
                  ).reduce((acc, value) => {
                    acc += value;
                    return acc;
                  }, 0);

                  const demoSaleData: any = {
                    id: row.id,
                    createdAt: row.createdAt,
                    payAmount: 0,
                    status: 'success',
                    product: {
                      ...row,
                      quantity,
                      sale_price: row.total_price / quantity,
                    },
                    customer: row.user,
                  };

                  setSaleDataToPOS(demoSaleData);
                }}
                variant="contained"
                size="small"
                color="warning"
                type="button"
              >
                Invoice
              </Button>
            </Link>
          ) : null}

          {row?.status === 'processing' ? (
            <>
              <MuiConfirmationDialog
                loading={banning?.true}
                showModal={showCancelWarning}
                warningText={`Want to '${capitalize(status)}' Order?`}
                onConfirm={statusHandler}
                confirmButtonText={'Ok'}
              />

              <Button
                onClick={() => {
                  showCancelWarning.setTrue();
                  setStatus('canceled');
                }}
                variant="contained"
                size="small"
                color="warning"
                type="button"
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  showCancelWarning.setTrue();
                  setStatus('delivered');
                }}
                variant="contained"
                size="small"
                color="primary"
                type="button"
              >
                Deliver
              </Button>
            </>
          ) : null}
        </>
      );
    },
    shouldHideDeleteButton(row) {
      return row.status === 'processing';
    },
  },
];

export default ordersTableCells;
