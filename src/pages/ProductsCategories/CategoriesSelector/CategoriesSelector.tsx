import RenderCategoriesSelector from './RenderCategoriesSelector';
import { useEffect, useState } from 'react';
import MuiTextField from '../../../common/MaterialUi/Forms/MuiTextField';
import useString from '../../../hooks/state/useString';
import FIcon from '../../../common/Icons/FIcon';
import convertToNestedCategories from '../../../app/features/products/convertToNestedCategories';
import useBoolean from '../../../hooks/state/useBoolean';
import Button from '../../../common/Buttons/Button';
import { CategoryT } from '../../../data';
import useCategories from '../../../hooks/react-query/useCategories';

type Props = Omit<
  Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'>,
  'defaultValue'
> & {
  onChange: <T>(category: CategoryT) => T | void;
  defaultValue?: CategoryT;
  open?: boolean;
  shouldRefetch?: boolean;
};

export default function CategoriesSelector({
  onChange,
  defaultValue,
  open,
  shouldRefetch,
  ...props
}: Props) {
  const { categories, refetchCategories } = useCategories();
  const [selected, setSelected] = useState<CategoryT>({} as CategoryT);

  const textfield = useString('');
  const showMe = useBoolean();

  useEffect(() => {
    textfield.setCustom(selected?.name);
    onChange && onChange(selected);
    selected && showMe.setFalse();
  }, [selected]);

  useEffect(() => {
    defaultValue && setSelected(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    refetchCategories();
  }, [shouldRefetch]);

  return (
    <div className="relative">
      <div className="relative">
        <MuiTextField
          placeholder={props.placeholder || 'Select Category'}
          value={textfield.value}
          onChange={textfield.change}
          onClick={showMe.setTrue}
          autoComplete="off"
          {...(props as any)}
        />

        {selected.name ? (
          <div className="absolute inset-y-0 right-4 my-auto flex h-full items-center gap-x-1">
            <button
              onClick={() => setSelected({} as CategoryT)}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
              title="remove parent category"
            >
              <FIcon icon="times" />
            </button>
            <span> {selected?.name} </span>
          </div>
        ) : null}
      </div>

      {open ? (
        <div
          className={`relative z-999 mx-auto max-h-[310px] overflow-auto bg-[#f1f1f1] p-4 ring-1 dark:bg-black-2`}
        >
          <RenderCategoriesSelector
            selected={selected}
            setSelected={setSelected}
            categories={
              textfield.value
                ? categories.filter((c) =>
                    c.name
                      ?.toLowerCase()
                      ?.includes(textfield?.value?.toLowerCase())
                  )
                : convertToNestedCategories(categories)
            }
          />
        </div>
      ) : showMe.true ? (
        <div
          className={`absolute inset-x-0 top-full z-999 mx-auto max-h-[310px] overflow-auto bg-[#fbf9f9] px-4 pb-4 pt-6 ring dark:bg-black-2`}
        >
          <div className="absolute -top-1 right-1 z-999 ml-auto w-5">
            <Button onClick={showMe.setFalse} color="red" size="custom">
              <FIcon icon="times" />
            </Button>
          </div>
          <RenderCategoriesSelector
            selected={selected}
            setSelected={setSelected}
            categories={
              textfield.value
                ? categories.filter((c) =>
                    c.name
                      ?.toLowerCase()
                      ?.includes(textfield?.value?.toLowerCase())
                  )
                : convertToNestedCategories(categories)
            }
          />
        </div>
      ) : null}
    </div>
  );
}
