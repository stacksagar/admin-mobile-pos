import RenderCategories from './RenderCategories'; 
import FIcon from '../../common/Icons/FIcon';
import { Button, IconButton } from '@mui/material';
import useBoolean, { UseBoolean } from '../../hooks/state/useBoolean';

type Props = {
  category: Category;
  showDeletePopup: UseBoolean;
  showEdit: UseBoolean;
  setEditItem: any;
  setDeleteID: any;
};

const ShowCategories = ({
  category,
  showDeletePopup,
  showEdit,
  setEditItem,
  setDeleteID,
}: Props) => {
  const openChildren = useBoolean();

  return (
    <li>
      <a href="#" className="main-category">
        <div className="relative w-full">
          <div onClick={openChildren.toggle} className="w-full">
            <h6 className="flex items-center gap-2 text-base font-medium sm:text-xl">
              {category.icon ? (
                <img className="w-4" src={category.icon} alt="" />
              ) : null}
              {category.name}
            </h6>
          </div>

          <div className="absolute inset-y-0 right-0 md:right-2">
            <IconButton
              onClick={() => {
                setEditItem(category);
                showEdit.toggle();
              }}
              aria-label="toggle"
              size="small"
            >
              <FIcon
                icon="edit"
                className="text-sm text-blue-500 md:text-base"
              />
            </IconButton>
            <IconButton
              onClick={() => {
                setDeleteID(category.id);
                showDeletePopup.toggle();
              }}
              aria-label="toggle"
              size="small"
            >
              <FIcon
                icon="trash"
                className="text-sm text-red-500 md:text-base"
              />
            </IconButton>
          </div>
        </div>

        {category?.children?.length ? (
          <div onClick={openChildren.toggle}>
            <Button variant="outlined">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white">
                {category?.children?.length}
              </span>

              {openChildren.true ? (
                <FIcon icon="chevron-down" />
              ) : (
                <FIcon icon="chevron-right" />
              )}
            </Button>
          </div>
        ) : (
          <small>
            {' '}
            <FIcon icon="dot-circle" className="text-[8px] opacity-50" />{' '}
          </small>
        )}
      </a>

      {category?.children?.length && openChildren.true ? (
        <ul className="sub-category-tabs">
          <RenderCategories
            categories={category.children}
            showDeletePopup={showDeletePopup}
            setEditItem={setEditItem}
            setDeleteID={setDeleteID}
            showEdit={showEdit}
          />
        </ul>
      ) : null}
    </li>
  );
};
export default ShowCategories;
