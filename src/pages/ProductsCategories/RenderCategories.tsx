import { UseBoolean } from '../../hooks/state/useBoolean'; 
import ShowCategories from './ShowCategories';

type Props = {
  categories: Category[];
  showDeletePopup: UseBoolean;
  showEdit: UseBoolean;
  setEditItem: any;
  setDeleteID: any;
};

function RendeCategories({
  categories,
  showDeletePopup,
  showEdit,
  setEditItem,
  setDeleteID,
}: Props) {
  return (
    <ul className="category-tabs">
      {categories?.map((c, i) => (
        <ShowCategories
          key={i}
          category={c}
          setDeleteID={setDeleteID}
          showEdit={showEdit}
          showDeletePopup={showDeletePopup}
          setEditItem={setEditItem}
        />
      ))}
    </ul>
  );
}

export default RendeCategories;
