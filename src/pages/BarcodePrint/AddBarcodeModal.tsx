import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import MuiResponsiveDialog from '../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { ProductT, ProductVariant } from '../../data';
import useBoolean, { UseBoolean } from '../../hooks/state/useBoolean';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import useString from '../../hooks/state/useString';
import toast from '../../libs/toast';
import { useEffect, useState } from 'react';
import MuiSelect from '../../common/MaterialUi/Forms/MuiSelect';
import SelectColorAndQuantity from './SelectColorAndQuantity';
import { IconButton } from '@mui/material';
import FIcon from '../../common/Icons/FIcon';

export type VariantOption = {
  index: number;
  title: string;
  price: number;
  ram: string;
  rom: string;
  processor: string;
  colors: {
    color: string;
    quantity: number;
    imeis: string[];
  }[];
};

export type Barcode = {
  color: string;
  imei: string;
  ram: string;
  rom: string;
  processor: string;
  price: number;
};

interface Props {
  openModal: UseBoolean;
  onSuccess?: any;
}

type ProductT2 = ProductT & { findname: string };

export default function AddBarcodeModal({ openModal, onSuccess }: Props) {
  const axios = useAxiosPrivate();

  const { data: products = [] } = useQuery<ProductT[]>(
    ['fetchProducts'],
    async () => {
      try {
        const { data } = await axios.get(`/product/stock-in/all`);
        return data || [];
      } catch (error) {
        console.log('error ', error);
      }
    }
  );

  const isSubmitting = useBoolean();
  const quantity = useString('');
  const scanBarcode = useString('');
  const selectVariantValue = useString('');

  const [selectedProduct, setSelectedProduct] = useState({} as ProductT2);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [selectedVariantOption, setSelectedVariantOption] = useState(
    {} as VariantOption
  );

  const [barcodes, setBarcodes] = useState([] as Barcode[]);

  function handleScanBarcode(e: React.ChangeEvent<HTMLInputElement>) {
    console.count('called');
    const value = e.target.value;
    scanBarcode.setCustom(value);
    const p = products.find((p) => p.barcode === value);

    if (p) {
      toast({
        message: 'Found!',
        type: 'info',
      });
      setSelectedProduct({
        ...p,
        findname: `${p?.name} (${p?.barcode})`,
      });
      scanBarcode.setCustom('');
    }
  }

  async function handleSubmit() {
    const p = selectedProduct;
    const payable: any = {
      productId: p?.id,
      with_multi: p?.with_variant,
      quantity: Number(quantity.value),
    };

    if (p?.with_variant) {
      payable.barcodes = barcodes;
    } else {
      payable.barcode = p?.barcode;
    }

    console.log('payable ', payable);

    try {
      await axios.post('/barcode', payable);
    } catch (error: any) {
      toast({
        message: error?.message,
        type: 'warning',
      });
    } finally {
      onSuccess && onSuccess();
      setSelectedProduct({} as any);
      openModal.toggle();
      isSubmitting.setFalse();
    }
  }

  useEffect(() => {
    const variants: ProductVariant[] = [...(selectedProduct?.variants || [])];

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
  }, [selectedProduct]);

  useEffect(() => {
    quantity.setCustom((barcodes?.length as any) || 0);
  }, [barcodes]);

  return (
    <MuiResponsiveDialog
      handleSubmit={handleSubmit}
      title={'Add Barcode'}
      openModal={openModal}
      loading={isSubmitting.true}
      submitWithButton
    >
      <div className="space-y-6">
        <div className="flex items-center justify-start gap-2">
          <div className="mt-2 w-fit">
            <MuiTextField
              value={scanBarcode.value}
              onChange={handleScanBarcode}
              label="Scan Barcode"
            />
          </div>

          <MuiSearchSelect
            label={'Select Product'}
            options={products?.map((p) => ({
              ...p,
              findname: `${p?.name} (${p?.barcode})`,
            }))}
            defaultTitle={selectedProduct?.findname || null}
            titleKey="findname"
            onChange={setSelectedProduct}
          />
        </div>

        {selectedProduct?.id ? (
          <div>
            <p>
              <b>Product ::: </b> {selectedProduct?.name}
            </p>
            <p>
              <b>In Stock ::: </b> {selectedProduct?.in_stock}
            </p>
          </div>
        ) : null}

        {selectedProduct?.with_variant ? (
          <div>
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
            <SelectColorAndQuantity
              setBarcodes={setBarcodes}
              selectedVO={selectedVariantOption}
              setSelectedVO={setSelectedVariantOption}
              resetSelectedVariant={() => selectVariantValue.setCustom('')}
            />
            <br />
            <div>
              <h2 className="text-lg">
                Items: <small>(IMEI/RAM-ROM/Price)</small>
              </h2>
              <div className="flex flex-wrap items-center gap-6">
                {barcodes?.map((item) => (
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
                        setBarcodes((p) =>
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

        <div className="flex flex-col gap-6">
          <MuiTextField
            disabled={selectedProduct?.with_variant}
            id="quantity"
            label="Quantity"
            value={quantity.value}
            onChange={(e) =>
              isNaN(e.target.value as any)
                ? quantity.setCustom('')
                : quantity.setCustom(e.target.value)
            }
          />
        </div>
      </div>
    </MuiResponsiveDialog>
  );
}
