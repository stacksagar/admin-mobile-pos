import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { ProductVariant } from '../../data';
import MultipleStringsOfKey from '../MultipleStringsOfKey/MultipleStringsOfKey';

interface PropsT {
  variants: ProductVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
  previousImeis?: string[];
  isEditPage?: boolean;
}

export default function VariantForm({
  variants,
  setVariants,
  previousImeis,
  isEditPage,
}: PropsT) {
  const addVariant = () => {
    setVariants((prevVariants) => [
      ...prevVariants,
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
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    setVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[index] = {
        ...newVariants[index],
        [field]:
          field === 'purchase_price' || field === 'sale_price'
            ? Number(value) || ''
            : value,
      };
      return newVariants;
    });
  };

  const removeVariant = (index: number) => {
    setVariants((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants.splice(index, 1);
      return newVariants;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {variants.map((variant, index) => (
        <div
          key={variant?.uid}
          className="rounded border bg-gray-100 p-4 shadow ring dark:border-transparent dark:bg-gray-900"
        >
          <div className="flex items-center justify-between pb-2">
            <p>
              Variant <b>{index + 1}</b>{' '}
            </p>
            <button
              type="button"
              disabled={isEditPage}
              onClick={() => (isEditPage ? null : removeVariant(index))}
              title="Add Variant"
              className="inline-flex w-fit items-center justify-center gap-2 rounded border border-transparent bg-red-500 px-3 py-2 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Object.keys(variant).map((key) =>
              key === 'imeis' || key === 'uid' ? null : (
                <div
                  key={key}
                  className={`flex ${
                    key === 'processor' ? 'col-span-full' : ''
                  }`}
                >
                  <MuiTextField
                    size="small"
                    disabled={isEditPage}
                    label={key?.split('_').join(' ')}
                    value={(variant as any)[key]}
                    onChange={(e) =>
                      handleInputChange(index, key, e.target.value)
                    }
                  />
                </div>
              )
            )}

            <div className="col-span-full">
              <MultipleStringsOfKey
                isEditPage={isEditPage}
                previousImeis={previousImeis}
                initialItems={variant.imeis}
                onChange={(imeis) => handleInputChange(index, 'imeis', imeis)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={isEditPage}
        onClick={isEditPage ? () => {} : addVariant}
        title="Add Variant"
        className="inline-flex w-full items-center justify-center gap-2 rounded border border-transparent bg-purple-600 px-2 py-3 text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
      >
        Add New Variant
      </button>
    </div>
  );
}
