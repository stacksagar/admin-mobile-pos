import { useAppDispatch, useAppSelector } from '../../app/store';
import useFetchDispatch from '../../hooks/redux/useFetchDispatch';
import { fetchProductsCategories } from '../../app/features/products/requests';
import FIcon from '../../common/Icons/FIcon';
import Breadcrumb from '../../components/Breadcrumb';
import { Button } from '@mui/material';
import RendeCategories from './RenderCategories';
import AddOrEditCategory from './CategoriesSelector/AddOrEditCategory';
import { useEffect, useState } from 'react';
import useBoolean from '../../hooks/state/useBoolean';
import MuiConfirmationDialog from '../../common/MaterialUi/Modal/MuiConfirmationDialog';
import convertToNestedCategories from '../../app/features/products/convertToNestedCategories';
import useNumber from '../../hooks/state/useNumber';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { removeCategory } from '../../app/features/products/categorySlice';

const ProductCategories = () => {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { data: categories } = useAppSelector((s) => s.products_categories);

  const isDeleting = useBoolean();
  const showDeletePopup = useBoolean();

  const [editItem, setEditItem] = useState<Category>({} as Category);
  const deleteID = useNumber();
  const showAddOrEditPopup = useBoolean(false);

  async function handleDeleteCategory() { 
    try {
      axios.delete(`/product/category/${deleteID.value}`);
      dispatch(removeCategory(deleteID.value));
    } catch (error) {
      toast({
        message: error_message(error),
        type: 'error',
      });
    } finally {
      showDeletePopup.setFalse();
      deleteID.setCustom(0);
    }
  }

  const [treesCategories, setTreesCategories] = useState<Category[]>([]);

  useFetchDispatch({
    data: categories,
    fetchFunc: fetchProductsCategories,
  });

  useEffect(() => {
    setTreesCategories(convertToNestedCategories(categories));
  }, [categories]);

  return (
    <div>
      <Breadcrumb pageName="Products Categories" />
      <AddOrEditCategory openModal={showAddOrEditPopup} editItem={editItem} />

      <MuiConfirmationDialog
        loading={isDeleting.true}
        showModal={showDeletePopup}
        warningText={`Want to delete category?`}
        onConfirm={handleDeleteCategory}
        confirmButtonText={'Delete'}
      />

      <div className="bg-white dark:bg-black dark:text-white">
        <div className="flex justify-between p-4 pb-0">
          <Button
            className="space-x-2 focus:ring focus:ring-offset-1"
            color="primary"
            variant="contained"
            size="large"
            onClick={() => {
              setEditItem({} as Category);
              showAddOrEditPopup.setTrue();
            }}
          >
            <FIcon icon="plus" />
            <span>Add New Category</span>
          </Button>
        </div>
        <div className="px-4 py-2">
          <RendeCategories
            setDeleteID={deleteID.setCustom}
            categories={treesCategories}
            showDeletePopup={showDeletePopup}
            setEditItem={setEditItem}
            showEdit={showAddOrEditPopup}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
