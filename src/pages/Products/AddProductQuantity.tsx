import { useNavigate, useSearchParams } from 'react-router-dom';
import { UseBoolean } from '../../hooks/state/useBoolean';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { ProductT, ProductVariant, SupplierT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import useObject from '../../hooks/state/useObject';
import MultipleVariants from '../../components/MultipleVariants/MultipleVariants';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useNumber from '../../hooks/state/useNumber';
import { Button } from '@mui/material';

interface PropsT {
  openModal: UseBoolean;
}
export default function AddProductQuantity({}: PropsT) {
  const axios = useAxiosPrivate();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  //   store previous values and store new values
  const prev_stock = useNumber(0);
  const [new_stock, setNewStock] = useState('');

  const previous_purchase_price = useNumber(0);
  const [new_purchase_price, setNewPurchasePrice] = useState('');

  const previous_total_purchase_amount = useNumber(0);
  const new_total_purchase_amount = useNumber(0);

  const previous_sale_price = useNumber(0);
  const [new_sale_price, setNewSalePrice] = useState('');

  const previous_total_sale_amount = useNumber(0);
  const new_total_sale_amount = useNumber(0);

  const [prevVariants, setPrevVariants] = useState([] as ProductVariant[]);
  const [newVariants, setNewVariants] = useState([] as ProductVariant[]);

  //   current paid and due amount create supplier history invoice with this paid/due amount
  const paid_amount = useNumber(0);
  const due_amount = useNumber(0);

  const [product, setProduct] = useState({} as ProductT);
  const selectedSupplier = useObject<SupplierT>({} as SupplierT);

  //   fetch all suppliers
  const { data: suppliers = [] } = useQuery<SupplierT[]>(
    ['fetchStockInProducts'],
    async () => {
      try {
        const { data } = await axios.get(`/supplier/all`);
        return data || [];
      } catch (error) {
        console.log('error ', error);
      }
    }
  );

  //   fetch product with id
  useEffect(() => {
    const id = params.get('id');
    if (!id) return navigate('/products');
    (async () => {
      const { data: product } = await axios.get<ProductT>(`/product/${id}`);
      if (!product?.id) return navigate('/products');

      setPrevVariants(product.variants || []);
      setProduct(product);

      previous_total_purchase_amount.setCustom(product.total_purchase_amount);
      previous_total_sale_amount.setCustom(product.total_sale_amount);

      prev_stock.setCustom(product.in_stock);

      previous_purchase_price.setCustom(product?.purchase_price);
      setNewPurchasePrice(product?.purchase_price?.toString());

      previous_sale_price.setCustom(product?.sale_price);
      setNewSalePrice(product?.sale_price?.toString());
    })();
  }, [params]);

  useEffect(() => {
    if (newVariants?.length < 1) return;

    let in_stock: number = 0;
    let total_purchase_amount: number = 0;
    let total_sale_amount: number = 0;

    setProduct((p) => ({
      ...p,
      variants: newVariants,
    }));

    newVariants?.map((variant) => {
      Object.values(variant?.imeis).map((imeis) => {
        in_stock += imeis?.length;
        total_purchase_amount += variant.purchase_price * imeis?.length;
        total_sale_amount += variant.sale_price * imeis?.length;
      });
    });

    setProduct((p) => ({
      ...p,
      in_stock,
      total_purchase_amount,
      total_sale_amount,
      purchase_price: total_purchase_amount / in_stock,
      sale_price: total_sale_amount / in_stock,
    }));

    paid_amount.setCustom(
      total_purchase_amount - previous_total_purchase_amount.value
    );
  }, [newVariants]);

  useEffect(() => {
    if (!product.with_variant) {
      paid_amount.setCustom(Number(new_purchase_price) * Number(new_stock));

      new_total_purchase_amount.setCustom(
        Number(new_purchase_price) * Number(new_stock)
      );
      new_total_sale_amount.setCustom(
        Number(new_sale_price) * Number(new_stock)
      );
    }
  }, [product, new_purchase_price, new_stock]);

  useEffect(() => {
    const paid = paid_amount.value;
    const total_purchase = new_total_purchase_amount.value;

    if (paid < 0 || paid > total_purchase) {
      paid_amount.setCustom(0);
      return;
    }

    due_amount.setCustom(total_purchase - paid);
  }, [paid_amount.value]);

  async function addQuantityHandler() {
    try {
      const { data } = await axios.put(`/product/add-quantity`, {
        productId: product?.id,
        supplierInvoice: {
          due_amount: due_amount.value,
          paid_amount: paid_amount.value,
          quantity: Number(new_stock),
        },
        supplierId: selectedSupplier.data?.id,

        //   product updated properties
        productData: {
          sale_price: Number(new_sale_price),
          purchase_price: Number(new_purchase_price),
          in_stock: prev_stock.value + Number(new_stock),
          total_purchase_amount:
            previous_total_purchase_amount.value +
            new_total_purchase_amount.value,

          total_sale_amount: 0,
          variants: product.variants,
        },
      });

      console.log('data ', data);
    } catch (error) {
      console.log('error ', error);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-7 w-full space-y-4 bg-white p-4 shadow dark:bg-gray-900">
        <h4 className="text-xl font-medium text-black dark:text-white">
          Add More Quantity of <b>{product?.name}</b>
        </h4>

        <MuiSearchSelect
          label={'Select Supplier'}
          defaultTitle={selectedSupplier?.data?.supplier_name || null}
          options={suppliers}
          titleKey="supplier_name"
          onChange={selectedSupplier.set}
        />

        {product?.with_variant ? (
          <MultipleVariants
            defaultVariants={prevVariants}
            onChange={setNewVariants}
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-2 gap-y-6">
            <MuiTextField
              label="Previous Stock"
              value={prev_stock.value}
              disabled
            />
            <MuiTextField
              label="New Stock"
              value={new_stock}
              type="number"
              onChange={(e) =>
                Number(e.target.value) > -1 && setNewStock(e.target.value)
              }
            />

            <MuiTextField
              label="Previous Purchase Price"
              value={previous_purchase_price.value}
              disabled
            />

            <MuiTextField
              label="New Purchase Price"
              value={new_purchase_price}
              type="number"
              onChange={(e) =>
                Number(e.target.value) > -1 &&
                setNewPurchasePrice(e.target.value)
              }
            />

            <MuiTextField
              label="Previous Sale Price"
              value={previous_sale_price.value}
              disabled
            />

            <MuiTextField
              label="New Sale Price"
              value={new_sale_price}
              type="number"
              onChange={(e) =>
                Number(e.target.value) > -1 && setNewSalePrice(e.target.value)
              }
            />
          </div>
        )}

        <Button onClick={addQuantityHandler} variant="contained">
          Submit New Quantity
        </Button>
      </div>

      <div className="col-span-5 space-y-4 bg-white p-4 shadow dark:bg-gray-900">
        <div className="space-y-2">
          <p>
            <b> Previous Stock: </b> {prev_stock.value}
          </p>
          <p>
            <b> New Stock: </b> {new_stock}
          </p>
          <p>
            <b> Total Stock: </b> {Number(prev_stock.value) + Number(new_stock)}
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <b> Previous Total Purchase Amount: </b>
            {previous_total_purchase_amount.value}
          </p>
          <p>
            <b>New Total Purchase Amount:</b>
            {new_total_purchase_amount.value}
          </p>
        </div>

        <h3 className="section_header"> Supplier History </h3>

        <MuiTextField
          required
          type="number"
          id="name"
          value={paid_amount.value}
          label="Paid Amount"
        />
        <MuiTextField
          required
          type="number"
          id="name"
          value={due_amount.value}
          label="Due Amount"
        />
      </div>
    </div>
  );
}
