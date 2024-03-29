import { useNavigate, useSearchParams } from 'react-router-dom';
import useBoolean from '../../hooks/state/useBoolean';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import { ProductT, ProductVariant, SupplierT, VatT } from '../../data';
import { useQuery } from '@tanstack/react-query';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import useObject from '../../hooks/state/useObject';
import MultipleVariants from '../../components/MultipleVariants/MultipleVariants';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import useNumber from '../../hooks/state/useNumber';
import { Button, IconButton } from '@mui/material';
import useString from '../../hooks/state/useString';
import { useAuth } from '../../context/auth';
import AddEditSupplierPopup from '../Suppliers/AddEditSupplierPopup';
import toast from '../../libs/toast';
import mergeVariants from '../../libs/algorithms/merge_variants';
import { VariantOption } from '../POS/SelectVariantAndQuantity';
import { getVat } from '../POS/functions';
import AddVatPopup from '../Vats/AddVatPopup';
import FIcon from '../../common/Icons/FIcon';
import useVats from '../../hooks/react-query/useVats';

export default function AddProductQuantity() {
  const { auth } = useAuth();
  const axios = useAxiosPrivate();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { vats, refetchVats } = useVats();

  const [previousImeis, setPrevIMEIs] = useState([] as string[]);

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

  // current paid and due amount create supplier history invoice with this paid/due amount
  const paid_amount = useString('');
  const due_amount = useString('');

  const [product, setProduct] = useState({} as ProductT);
  const selectedSupplier = useObject<SupplierT>({} as SupplierT);
  const selectedVat = useObject<VatT>({} as VatT);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);

  // fetch all suppliers
  const { data: suppliers = [], refetch: refetchSuppliers } = useQuery<
    SupplierT[]
  >(['fetchStockInProducts'], async () => {
    try {
      const { data } = await axios.get(`/supplier/all`);
      return data || [];
    } catch (error) {
      console.log('error ', error);
    }
  });

  const showAddSupplierPopup = useBoolean();
  const showAddVatPopup = useBoolean();
  useEffect(() => {
    refetchSuppliers();
  }, [showAddSupplierPopup.true]);

  // fetch product with id
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

      product?.variants?.map((v) => {
        Object.values(v.imeis).map((imeis) => {
          setPrevIMEIs((p) => [...p, ...imeis]);
        });
      });
    })();
  }, [params]);

  useEffect(() => {
    if (newVariants?.length < 1 || !product?.with_variant) return;

    let in_stock: number = 0;
    let total_purchase_amount: number = 0;
    let total_sale_amount: number = 0;

    newVariants?.map((variant) => {
      Object.values(variant?.imeis).map((imeis) => {
        in_stock += imeis?.length;
        total_purchase_amount += variant.purchase_price * imeis?.length;
        total_sale_amount += variant.sale_price * imeis?.length;
      });
    });

    setNewStock(in_stock as any);
    new_total_purchase_amount.setCustom(total_purchase_amount);
    new_total_sale_amount.setCustom(total_sale_amount);
    setNewPurchasePrice((total_purchase_amount / in_stock) as any);
    setNewSalePrice((total_sale_amount / in_stock) as any);
    paid_amount.setCustom(total_purchase_amount.toString());
  }, [newVariants]);

  useEffect(() => {
    if (product.with_variant) {
      // set variants for show before price
      const variants: ProductVariant[] = [...(product?.variants || [])];
      const lists = variants?.map((v, index) => ({
        index,
        title: `${v?.rom}-${v?.ram} ~ (${v?.processor})`,
        price: v.sale_price,
        purchase_price: v.purchase_price,
        ram: v.ram,
        rom: v.rom,
        processor: v.processor,
        colors: Object.entries(v?.imeis)?.map(([color, imeis]) => ({
          color,
          quantity: imeis.length,
          imeis,
        })),
      }));
      setVariantOptions(lists as any);
    } else {
      const newStock = Number(new_stock);
      const newPurchasePrice = Number(new_purchase_price);
      const newTotalPurchase = newStock * newPurchasePrice;
      new_total_purchase_amount.setCustom(newTotalPurchase);
      paid_amount.setCustom(newTotalPurchase as any);
    }
  }, [product, new_purchase_price, new_stock]);

  useEffect(() => {
    const paid = Number(paid_amount.value);
    const total_purchase = new_total_purchase_amount.value;

    if (paid < 0 || paid > total_purchase) {
      paid_amount.setCustom('');
      return;
    }

    due_amount.setCustom((total_purchase - paid).toString());
  }, [paid_amount.value]);

  useEffect(() => {
    const due = Number(due_amount.value);
    const total_purchase = new_total_purchase_amount.value;

    if (due < 0 || due > total_purchase) {
      due_amount.setCustom('');
      return;
    }

    paid_amount.setCustom((total_purchase - due).toString());
  }, [due_amount.value]);

  async function addQuantityHandler() {
    if (!selectedSupplier?.data?.id) {
      toast({ message: 'Please select supplier!', type: 'warning' });
      return;
    }

    const payable_data = {
      adminId: auth?.user?.id,
      productId: product?.id,
      supplierId: selectedSupplier.data?.id,

      supplierInvoice: {
        due_amount: Number(due_amount.value || '0'),
        paid_amount: Number(paid_amount.value || '0'),
        quantity: Number(new_stock || '0'),
      },

      productData: {
        sale_price: Number(new_sale_price || '0'),
        purchase_price: Number(new_purchase_price || '0'),
        in_stock: prev_stock.value + Number(new_stock || '0'),
        total_purchase_amount:
          new_total_purchase_amount.value +
          previous_total_purchase_amount.value,
        total_sale_amount:
          new_total_sale_amount.value + previous_total_sale_amount.value,
        variants: mergeVariants(prevVariants, newVariants),
      },
    };

    try {
      await axios.put(`/product/add-quantity`, payable_data);

      toast({
        message: 'Addedd New Quantity!',
      });
      axios.post('/tax', {
        name: `Added ${product.name} New Quantity!`,
        value: getVat(
          Number(new_purchase_price) * Number(new_stock),
          selectedVat.data
        ),
        description: `purchase new product quantity of ${product.name} ${new_stock} pc. from ${selectedSupplier.data?.supplier_name} - ${selectedSupplier?.data?.email}`,
      });

      navigate('/products');
    } catch (error) {
      console.log('error ', error);
      navigate('/products');
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <AddEditSupplierPopup openModal={showAddSupplierPopup} />

      <div className="col-span-7 w-full space-y-4 bg-white p-4 shadow dark:bg-gray-900">
        <h4 className="text-xl font-medium text-black dark:text-white">
          Add More Quantity of <b>{product?.name}</b>
        </h4>

        <div className="flex items-center gap-2">
          <MuiSearchSelect
            label={'Select Supplier'}
            defaultTitle={selectedSupplier?.data?.supplier_name || null}
            options={suppliers}
            titleKey="supplier_name"
            onChange={selectedSupplier.set}
          />

          <Button onClick={showAddSupplierPopup.toggle} variant="contained">
            Add
          </Button>
        </div>
        {product?.with_variant ? (
          <MultipleVariants
            previousImeis={previousImeis}
            // defaultVariants={prevVariants}
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

            <div className="col-span-full">
              <div className="flex items-center gap-2">
                <AddVatPopup
                  openModal={showAddVatPopup}
                  _finally={refetchVats}
                />
                <MuiSearchSelect
                  label={selectedVat?.data?.name ? 'Vat' : 'Select Vat'}
                  defaultTitle={
                    selectedVat?.data?.name
                      ? `${selectedVat?.data?.name} ${
                          selectedVat?.data?.value
                        }${selectedVat?.data?.type === 'percentage' ? '%' : ''}`
                      : null
                  }
                  options={vats?.map((d) => ({
                    ...d,
                    key: `${d.name} ${d?.value}${
                      d?.type === 'percentage' ? '%' : ''
                    }`,
                  }))}
                  titleKey="key"
                  onChange={selectedVat.set}
                />
                <IconButton onClick={showAddVatPopup.setTrue}>
                  <FIcon icon="plus" />
                </IconButton>
              </div>
            </div>
          </div>
        )}

        <Button onClick={addQuantityHandler} variant="contained">
          Submit New Quantity
        </Button>
      </div>

      <div className="col-span-5 space-y-4 bg-white p-4 shadow dark:bg-gray-900">
        <h2 className="text-xl">Previous Purchase Prices</h2>
        <div className="space-y-1">
          {variantOptions
            ?.sort((a, b) => a.purchase_price - b?.purchase_price)
            ?.map((v) => (
              <div
                key={v.title}
                className="rounded bg-gray-100 p-2 font-medium text-black shadow"
              >
                <p>
                  RAM:{v?.ram} - ROM:{v?.rom} - P:
                  {v?.processor}
                </p>
                <p>
                  Purchase Price: <b>{v?.purchase_price}</b>{' '}
                </p>
              </div>
            ))}
        </div>
        <div className="my-2 border-t dark:border-gray-500"></div>
        <div className="space-y-1">
          <p className="flex justify-between">
            <b> Previous Stock: </b> <span> {prev_stock.value} </span>
          </p>
          <p className="flex justify-between">
            <b> Now New Stock: </b> <span> {new_stock} </span>
          </p>
          <p className="flex justify-between">
            <b> Total Stock: </b>
            <span> {Number(prev_stock.value) + Number(new_stock)} </span>
          </p>
        </div>
        <div className="my-2 border-t dark:border-gray-500"></div>
        <div className="space-y-1">
          <p className="flex justify-between">
            <b> Previous Total Purchase Amount: </b>
            <span> {previous_total_purchase_amount.value} </span>
          </p>
          <p className="flex justify-between">
            <b>Now New Total Purchase Amount: </b>
            <span>{new_total_purchase_amount.value}</span>
          </p>
          <p className="flex justify-between">
            <b>Total Purchase Amount: </b>
            <span>
              {' '}
              {previous_total_purchase_amount.value +
                new_total_purchase_amount.value}{' '}
            </span>
          </p>
        </div>

        <h3 className="section_header"> Supplier History </h3>

        <div className="py-2 text-lg font-semibold">
          Vat:
          {getVat(
            Number(new_purchase_price) * Number(new_stock),
            selectedVat.data
          ) || 0}
        </div>

        <MuiTextField
          required
          type="number"
          id="name"
          value={paid_amount.value}
          onChange={(e) =>
            Number(e.target.value) > -1 && paid_amount.setCustom(e.target.value)
          }
          label="Paid Amount"
        />

        <MuiTextField
          required
          type="number"
          id="name"
          value={due_amount.value}
          onChange={(e) =>
            Number(e.target.value) > -1 && due_amount.setCustom(e.target.value)
          }
          label="Due Amount"
        />
      </div>
    </div>
  );
}
