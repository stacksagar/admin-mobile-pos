import { Button } from '@mui/material';
import { showDate } from '../../utils/date';
import { Link } from 'react-router-dom';
import { ProductT } from '../../data';

const productsTableCells: MuiTableHeader<ProductT>[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'createdAt',
    label: 'Date',
    RenderComponent({ row: product }) {
      return <div> {showDate(product?.createdAt, true)} </div>;
    },
  },
  { key: 'name' },
  {
    key: 'sale_price',
    label: 'Price',
    RenderComponent({ row: product }) {
      return (
        <div>
          <div>
            {product?.with_variant ? 'Avarage ' : ''} Purchase: ৳
            {Math.floor(product?.purchase_price)}
          </div>
          <div>
            {product?.with_variant ? 'Avarage ' : ''} Sell: ৳
            {Math.floor(product?.sale_price)}
          </div>
        </div>
      );
    },
  },
  {
    key: 'in_stock',
    label: 'In Stock',
  },
  {
    key: 'total_sale',
    label: 'Total Sales',
  },
  {
    key: 'custom',
    label: 'Custom Properties',
    RenderComponent({ row: product }) {
      return (
        <div className="flex flex-col gap-2">
          {Object.entries(product?.custom || {}).map(([key, value]) => (
            <div key={key}>
              {key}: {value}
            </div>
          ))}
        </div>
      );
    },
  },

  {
    key: 'actions',
    ActionButtons({ row: product }) {
      // const axios = useAxiosPrivate();
      // const dispatch = useAppDispatch();

      // async function copyProduct() {
      //   const copyData = {
      //     ...product,
      //     name: product.name + `-c${uid(3)}`,
      //     total_sale: 0,
      //     id: null,
      //     updatedAt: null,
      //     createdAt: null,
      //   };

      //   const { data } = await axios.post('/product', copyData);
      //   data && dispatch(addProduct(data));
      // }

      return (
        <>
          <Link to={`/add-product-quantity?id=${product.id}`}>
            <Button
              variant="contained"
              title="Edit"
              color="warning"
              size="small"
            >
              Add
            </Button>
          </Link>

          <Link to={`/edit-product?id=${product.id}`}>
            <Button variant="contained" title="Edit" size="small">
              Edit
            </Button>
          </Link>

          {/* <Button
            onClick={copyProduct}
            variant="contained"
            title="Edit"
            color="secondary"
            size="small"
          >
            Copy
          </Button> */}
        </>
      );
    },
  },
];

export default productsTableCells;
