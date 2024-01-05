import { Barcode, VariantOption } from './AddBarcodeModal';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { Button } from '@mui/material';
import { useState } from 'react';
import { uid } from 'uid';

interface PropsT {
  selectedVO: VariantOption;
  setBarcodes: React.Dispatch<React.SetStateAction<Barcode[]>>;
  setSelectedVO: React.Dispatch<React.SetStateAction<VariantOption>>;
  resetSelectedVariant: any;
}

export default function SelectColorAndQuantity({
  selectedVO,
  setBarcodes,
  setSelectedVO,
  resetSelectedVariant,
}: PropsT) {
  const [quantities, setQuantities] = useState(
    {} as { [color: string]: number }
  );

  function addColorQuantity() {
    const bcodes: Barcode[] = [];

    const colors = Object.keys(quantities || {});
    selectedVO?.colors?.map((item) => {
      const quantity = quantities[item.color] || 0;
      if (colors.includes(item.color) && quantity > 0) {
        const imeis = item.imeis.slice(
          item.imeis.length - quantity,
          item.imeis.length
        );
        imeis.map((imei) => {
          bcodes.push({
            color: item.color,
            imei,
            ram: selectedVO?.ram,
            rom: selectedVO?.rom,
            processor: selectedVO?.processor,
            price: selectedVO?.price,
          });
        });
      }
    });

    setBarcodes((prev) => {
      const all = [...prev, ...bcodes];
      const unique_all = [];
      const seenImeis = new Set();

      for (const item of all) {
        if (!seenImeis.has(item.imei)) {
          unique_all.push(item);
          seenImeis.add(item.imei);
        }
      }

      return unique_all;
    });

    setQuantities({});
    setSelectedVO({} as VariantOption);
    resetSelectedVariant();
  }

  function changeQuantity(quantity: number, max: number, color: string) {
    if (quantity < 0) return;
    setQuantities((p) => ({
      ...p,
      [color]: quantity > max ? max : quantity,
    }));
  }

  return (
    <div className="space-y-3 py-3">
      <div> Select Color with Quantity </div>
      {selectedVO?.colors?.map(({ color, quantity }) => (
        <div key={uid()} className="flex items-center justify-start gap-2">
          <div className="w-fit">
            <MuiTextField
              className="w-fit"
              value={quantities[color]}
              onChange={(e) =>
                changeQuantity(Number(e.target.value), quantity, color)
              }
              size="medium"
              type="number"
              label={`Write ${color?.toUpperCase()} color quantity`}
            />
          </div>
          <span className="whitespace-nowrap">
            Color: <b>{color}</b> ~
          </span>
          <span className="whitespace-nowrap">
            Available: <b>{quantity}</b>
          </span>
        </div>
      ))}
      <Button onClick={addColorQuantity} variant="contained">
        Add
      </Button>
    </div>
  );
}
