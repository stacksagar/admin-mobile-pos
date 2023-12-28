import { useEffect, useState } from 'react';
import VariantForm from './VariantForm';
import { ProductVariant } from '../../data';

export default function MultipleVariants({
  onChange,
}: {
  onChange: (variants: ProductVariant[]) => void;
}) {
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      uid: (Math.random() * 999).toString(),
      processor: '',
      ram: '',
      rom: '',
      purchase_price: '' as any,
      sale_price: '' as any,
      imeis: {},
    },
  ]);

  useEffect(() => {
    onChange(variants);
  }, [variants]);

  return <VariantForm variants={variants} setVariants={setVariants} />;
}
