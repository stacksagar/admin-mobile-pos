 
import ShowCategoriesSelector from './ShowCategoriesSelector';

interface Props {
  categories: Category[];
  selected?: Category;
  setSelected?: React.Dispatch<React.SetStateAction<Category>>;
}

function RenderCategoriesSelector({
  categories,
  selected,
  setSelected,
}: Props) {
  return (
    <ul className="category-tabs category-selector">
      {categories?.map((c, i) => (
        <ShowCategoriesSelector
          selected={selected}
          setSelected={setSelected}
          key={i}
          category={c}
        />
      ))}
    </ul>
  );
}

export default RenderCategoriesSelector;
