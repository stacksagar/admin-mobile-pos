import { IconButton } from '@mui/material';
import FIcon from '../../common/Icons/FIcon';
import AddCustomerPopup from '../Customers/AddCustomerPopup';
import useBoolean from '../../hooks/state/useBoolean';
import { Link } from 'react-router-dom';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { useEffect, useState } from 'react';
import { ProductT, ProductVariant, SingleVariant } from '../../data';
import useCustomers from '../../hooks/react-query/useCustomers';
import useProducts from '../../hooks/react-query/useProducts';
import { usePOS } from '../../context/pos/pos';
import useObject from '../../hooks/state/useObject';
import MuiSelect from '../../common/MaterialUi/Forms/MuiSelect';
import { Barcode, VariantOption } from '../BarcodePrint/AddBarcodeModal';
import useString from '../../hooks/state/useString';
import SelectVariantAndQuantity from './SelectVariantAndQuantity';

type ProductT2 = ProductT & { findname: string };

interface Props {}

export default function POSHeaderSelector({}: Props) {
  const { customer, products: pos_products } = usePOS();

  const { customers } = useCustomers();
  const { products } = useProducts();
  const [selectedVariants, setSelectedVariants] = useState([] as Barcode[]);

  const selectVariantValue = useString('');
  const [selectedVariantOption, setSelectedVariantOption] = useState(
    {} as VariantOption
  );

  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const selectedProduct = useObject({} as ProductT2);
  const openAddCustomerPopup = useBoolean();
  const [barcode, setBarcode] = useState('');

  function handleWithScan(code: string) {
    setBarcode(code);
    const product = products.find((p) => p.barcode?.trim() === code?.trim());
    if (product?.id) {
      setBarcode('');
    }
  }

  function handleSelectProduct(product: ProductT) {
    const selected = product as ProductT2;
    selectedProduct.set(selected);

    if (product?.with_variant) {
      const variants: ProductVariant[] = [...(selected?.variants || [])];
      const lists = variants?.map((v, index) => ({
        index,
        title: `${v?.rom}-${v?.ram} ~ (${v?.processor})`,
        price: v.sale_price,
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
      addWithoutVariantProduct(product);
    }
  }

  function addWithoutVariantProduct(product: ProductT) {
    const exist = pos_products?.data?.find((p) => p?.id === product?.id);

    if (exist) {
      const quantity = (exist?.quantity || 0) + 1;
      const newData = {
        ...exist,
        quantity,
        total_price: exist?.sale_price * quantity,
        price: exist?.sale_price,
      };

      pos_products.update(newData, 'id');
    } else {
      pos_products.add({
        ...product,
        price: product.sale_price,
        quantity: 1,
        total_price: product.sale_price,
      });
    }
  }

  function addWithVariantProduct(items: SingleVariant[]) {
    items?.map((item) => {
      const product = {
        ...selectedProduct.data,
        ...item,
        quantity: 1,
        price: item.price,
        total_price: item.price,
      };

      const found = pos_products.data?.find((p) => p.imei === item.imei);
      if (!found) {
        pos_products.set((p) => [...p, product as any]);
      }
    });
  }

  useEffect(() => {
    console.log('pos_products ', pos_products);
  }, [pos_products]);

  return (
    <div className="grid gap-2 md:grid-cols-2 lg:gap-6 xl:gap-12">
      <div className="flex items-center gap-2">
        <div className="mt-2">
          <MuiTextField
            value={barcode}
            onChange={(e) => handleWithScan(e.target.value)}
            label="Scan Barcode"
          />
        </div>

        <MuiSearchSelect
          label={'Select Product'}
          options={products?.map((p) => ({
            ...p,
            uid: `${p.name} (${p?.barcode})`,
          }))}
          titleKey="uid"
          onChange={handleSelectProduct}
        />

        <Link to="/add-product">
          <IconButton>
            <FIcon icon="plus" />
          </IconButton>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <AddCustomerPopup openModal={openAddCustomerPopup} />

        <MuiSearchSelect
          label={'Select Customer'}
          defaultTitle={customer?.data?.name || null}
          options={customers || []}
          titleKey="name"
          onChange={customer.set}
        />

        <IconButton onClick={openAddCustomerPopup.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="col-span-full">
        {selectedProduct?.data?.with_variant ? (
          <div>
            <div className="grid grid-cols-2 items-start gap-4">
              <MuiSelect
                label="Select Variant"
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedVariantOption(
                    (variantOptions.find((v) => v.title === value) || {}) as any
                  );
                  selectVariantValue.setCustom(value as string);
                }}
                value={selectVariantValue.value}
                options={variantOptions.map((v) => ({
                  title: v.title,
                  value: v.title,
                }))}
              />
              <SelectVariantAndQuantity
                getVariants={addWithVariantProduct}
                selectedVO={selectedVariantOption}
                setSelectedVO={setSelectedVariantOption}
                resetSelectedVariant={() => selectVariantValue.setCustom('')}
              />
            </div>
            <br />

            <div>
              <div className="flex flex-wrap items-center gap-6">
                {selectedVariants?.map((item) => (
                  <div key={item.imei} className="flex items-center gap-2">
                    <p className="space-x-1">
                      <span>IIMEI:{item?.imei} </span>
                      <b>
                        ({item?.ram}/{item?.rom})
                      </b>
                      <span>({item?.price})</span>
                    </p>
                    <IconButton
                      onClick={() =>
                        setSelectedVariants((p) =>
                          p.filter((c) => c.imei !== item?.imei)
                        )
                      }
                      size="small"
                    >
                      <FIcon icon="trash" />
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
