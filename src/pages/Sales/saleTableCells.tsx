import { Button, IconButton } from '@mui/material';
import { SaleT, UserT } from '../../data';
import { showDate } from '../../utils/date';
import FIcon from '../../common/Icons/FIcon';
import { Link } from 'react-router-dom';
import { usePOS } from '../../context/pos/pos';
import { POSProductT } from '../../context/pos/POSContext';

function saleTableCells(handleReturnButton: (sale: SaleT) => void) {
  const cells: MuiTableHeader<SaleT>[] = [
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
      key: 'customerId',
      label: 'Customer',
      RenderComponent({ row }) {
        return (
          <div>
            <p> {row?.customer?.name} </p>
            <div className="flex items-center gap-1">
              <IconButton size="small">
                <a
                  title="phone"
                  target="_blank"
                  href={`tel:${row?.customer?.phone}`}
                >
                  <FIcon icon="phone" />
                </a>
              </IconButton>
              <IconButton size="small">
                <a
                  title="whatsapp"
                  target="_blank"
                  href={`https://api.whatsapp.com/send?phone=${
                    row?.customer?.phone?.includes('+88')
                      ? row?.customer?.phone
                      : '+88' + row?.customer?.phone
                  }`}
                >
                  <FIcon icon="whatsapp" />
                </a>
              </IconButton>{' '}
              <IconButton size="small">
                <a
                  title="email"
                  target="_blank"
                  href={`mailto:${row?.customer?.email}`}
                >
                  <FIcon icon="envelope" />
                </a>
              </IconButton>
            </div>
          </div>
        );
      },
    },

    {
      key: 'productId',
      label: 'Product',
      RenderComponent({ row }) {
        return (
          <div>
            <p> {row?.product?.name} </p>
            {row?.with_variant ? (
              <>
                <p>
                  <b>ram:</b> {row.properties?.ram}{' '}
                </p>
                <p>
                  <b>rom:</b> {row.properties?.rom}{' '}
                </p>
                <p>
                  <b>color:</b> {row.properties?.color}{' '}
                </p>
                <p>
                  <b>processor:</b> {row.properties?.processor}{' '}
                </p>
                <p>
                  <b>imei:</b> {row.properties?.imei}{' '}
                </p>
              </>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'quantity',
    },
    {
      key: 'total',
      RenderComponent({ row }) {
        return (
          <div>
            <p>
              <b>Per Unit</b> : {row?.total / row?.quantity}
            </p>
            <p>
              <b>Total Price</b> : {row?.total}
            </p>
            <p>
              <b>Paid Amount</b> : {row?.paid}
            </p>
            <p>
              <b>Due Amount</b> : {row?.due}
            </p>
          </div>
        );
      },
    },

    {
      key: 'actions',
      ActionButtons({ row }) {
        const {
          customer,
          vat_amount,
          discount_amount,
          payable_amount,
          paid,
          products,
          invoice_id,
        } = usePOS();

        function handleInvoice(sale: SaleT) {
          products.reset();
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

          console.log('sale ', sale?.id);
          sale?.id && invoice_id?.setCustom(sale?.id);
        }

        return (
          <>
            <Link to="/pos_invoice">
              <Button
                title="View Invoice"
                variant="contained"
                size="small"
                onClick={() => handleInvoice(row)}
              >
                Invoice
              </Button>
            </Link>

            <Button
              title="Refund"
              variant="contained"
              size="small"
              color="warning"
              onClick={() => handleReturnButton(row)}
            >
              Return
            </Button>
          </>
        );
      },
    },
  ];
  return cells;
}

export default saleTableCells;
