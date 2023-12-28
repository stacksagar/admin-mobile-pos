import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { uid } from 'uid';
import { ProductVariant } from '../../data';
import ColorAndIMEI from './ColorAndIMEI';

interface Props {
  variant: ProductVariant;
  variants: ProductVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
  index: number;
}

function Variant({ index, variant, variants, setVariants }: Props) {
  const [newVariant, setNewVariant] = useState<ProductVariant>(variant);

  function changeNewVariant(e: React.ChangeEvent<HTMLInputElement>) {
    setNewVariant((p) => ({ ...p, [e.target.id]: e.target.value }));
  }

  function shouldUpdate() {
    setVariants((p) => p.map((v, i) => (i === index ? newVariant : v)));
  }

  // function setColorAndIMEIs(key: string, value: string[]) {
  //   console.log('key ', key);
  //   console.log('value ', value);
  //   setVariants((p) =>
  //     p.map((v, i) =>
  //       i === index
  //         ? {
  //             ...newVariant,
  //             imeis: {
  //               ...newVariant.imeis,
  //               [key]: value,
  //             },
  //           }
  //         : v
  //     )
  //   );
  // }

  return (
    <div className="grid grid-cols-1 gap-2 rounded bg-gray-50 p-3 shadow sm:grid-cols-2 dark:bg-gray-900">
      <TextField
        value={newVariant.processor}
        onChange={changeNewVariant}
        onMouseLeave={shouldUpdate}
        id="processor"
        className="w-full"
        label="Processor"
        size="small"
      />

      <TextField
        value={newVariant.color}
        onChange={changeNewVariant}
        onMouseLeave={shouldUpdate}
        id="color"
        className="w-full"
        label="Color"
        size="small"
      />

      <TextField
        value={newVariant.ram}
        onChange={changeNewVariant}
        onMouseLeave={shouldUpdate}
        id="ram"
        className="w-full"
        label="RAM"
        size="small"
      />

      <TextField
        value={newVariant.rom}
        onChange={changeNewVariant}
        onMouseLeave={shouldUpdate}
        id="rom"
        className="w-full"
        label="ROM"
        size="small"
      />

      <TextField
        value={newVariant.purchase_price}
        onChange={(e) =>
          setNewVariant((p) => ({
            ...p,
            purchase_price:
              e.target.value === '0'
                ? '0'
                : Number(e.target.value) || ('' as any),
          }))
        }
        onMouseLeave={shouldUpdate}
        id="purchase_price"
        className="w-full"
        label="Purchase Price"
        size="small"
      />

      <TextField
        value={newVariant.sale_price}
        onChange={(e) =>
          setNewVariant((p) => ({
            ...p,
            sale_price:
              e.target.value === '0'
                ? '0'
                : Number(e.target.value) || ('' as any),
          }))
        }
        onMouseLeave={shouldUpdate}
        id="sale_price"
        className="w-full disabled:opacity-50"
        label="Sale Price"
        size="small"
      />

      <div className="col-span-full">
        <ColorAndIMEI
          defaultIMEIs={variant.imeis}
          onChange={(IMEISSS) => console.log('IMEISSS ', IMEISSS)}
        />
      </div>

      <div className="flex w-fit items-center gap-2">
        <Button
          onClick={() =>
            variants && variants?.length > 1
              ? setVariants &&
                setVariants((p) => p.filter((_, i) => i !== index))
              : null
          }
          variant="contained"
          size="small"
          color="warning"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function ProductVariants({
  variants,
  setVariants,
}: {
  variants: ProductVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
}) {
  const empty_variant: ProductVariant = {
    imeis: {
      white: ["324SDFS", "324SDFS"]
    },
    color: '',
    processor: '',
    ram: '',
    rom: '',
    purchase_price: '' as any,
    sale_price: '' as any,
  };

  useEffect(() => {
    if (variants && variants?.length < 1) {
      setVariants && setVariants([empty_variant]);
    }
  }, [empty_variant, variants]);

  return (
    <div className="col-span-full space-y-5">
      {variants?.map((v, index) => (
        <Variant
          key={uid()}
          index={index}
          variants={variants}
          setVariants={setVariants}
          variant={v}
        />
      ))}

      <div
        onClick={() => setVariants && setVariants((p) => [...p, empty_variant])}
        className="flex w-fit flex-wrap gap-2"
      >
        <Button color="primary" variant="contained">
          Add New Variant
        </Button>
      </div>
    </div>
  );
}
