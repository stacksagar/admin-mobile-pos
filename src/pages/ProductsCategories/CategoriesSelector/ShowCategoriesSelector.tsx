import RenderCategoriesSelector from './RenderCategoriesSelector'; 
import FIcon from '../../../common/Icons/FIcon';
import { Button } from '@mui/material';
import useBoolean from '../../../hooks/state/useBoolean';

interface Props {
  category: Category;
  selected?: Category;
  setSelected?: React.Dispatch<React.SetStateAction<Category>>;
}
const ShowCategoriesSelector = ({ category, selected, setSelected }: Props) => {
  const openChildren = useBoolean();

  return (
    <li>
      <a href="#" className="main-category avoid_blur_hidden">
        <div
          onClick={() => setSelected && setSelected(category)}
          className="w-full"
        >
          <h6 className="space-x-2 text-base font-medium sm:text-xl">
            <span>{category.name}</span>
            {selected?.id === category?.id ? (
              <FIcon icon="check-circle" className="text-blue-600" />
            ) : null}
          </h6>
        </div>

        {category?.children?.length ? (
          <div onClick={openChildren.toggle} className="avoid_blur_hidden">
            <Button variant="outlined" className="avoid_blur_hidden">
              <small className="avoid_blur_hidden mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
                {category?.children?.length}
              </small>

              {openChildren.true ? (
                <FIcon icon="chevron-down" className="avoid_blur_hidden" />
              ) : (
                <FIcon icon="chevron-right" className="avoid_blur_hidden" />
              )}
            </Button>
          </div>
        ) : (
          <small>
            <FIcon icon="dot-circle" className="text-[8px] opacity-50" />{' '}
          </small>
        )}
      </a>

      {category?.children?.length && openChildren.true ? (
        <ul className="sub-category-tabs">
          <RenderCategoriesSelector
            selected={selected}
            setSelected={setSelected}
            categories={category.children}
          />
        </ul>
      ) : null}
    </li>
  );
};

export default ShowCategoriesSelector;
