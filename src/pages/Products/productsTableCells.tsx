import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ProductT } from '../../data';

const productsTableCells: MuiTableHeader<ProductT>[] = [
  {
    key: 'id',
    label: 'ID',
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
    key: 'variants',
    RenderComponent({ row }) {
      return (
        <div className="space-y-2">
          <div>
            <p className="font-semibold"> Total Stock: {row?.in_stock} </p>
            <p className="font-semibold"> Total Sale: {row?.total_sale} </p>
          </div>
          {row?.variants?.map((v) => (
            <div className="w-fit rounded bg-[#5555551f] bg-opacity-90 p-2">
              <p>
                Ram/Rom/Process: {v?.ram}GB/{v?.rom}GB/{v?.processor}
              </p>
              <p> Purchase Price: {v?.purchase_price} </p>
              <p>
                Stock:{' '}
                {Object.values(v?.imeis)?.reduce(
                  (acc, val) => acc + val.length,
                  0
                )}
              </p>
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
