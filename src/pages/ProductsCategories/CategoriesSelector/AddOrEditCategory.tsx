import MuiResponsiveDialog from '../../../common/MaterialUi/Modal/MuiResponsiveDialog';
import { UseBoolean } from '../../../hooks/state/useBoolean';
import { useFormik } from 'formik';
import MuiTextField from '../../../common/MaterialUi/Forms/MuiTextField';
import toast from '../../../libs/toast';

import { useEffect, useState } from 'react';
import error_message from '../../../utils/error_message';
import Label from '../../../common/Forms/Label';
import CategoriesSelector from './CategoriesSelector';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  addCategory,
  updateCategory,
} from '../../../app/features/products/categorySlice';
import useAxiosPrivate from '../../../hooks/axios/useAxiosPrivate';
import findCategory from '../../../app/features/products/findCategory';
import onChangeSetURL from '../../../utils/onChangeSetURL';
import slug_generator from '../../../utils/slug_generator';
import { CategoryT } from '../../../data';

interface Props {
  openModal: UseBoolean;
  editItem?: CategoryT;
  _finally?: () => void;
}

export default function AddOrEditCategory({
  openModal,
  editItem,
  _finally,
}: Props) {
  const axios = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { data: categories } = useAppSelector((s) => s.products_categories);
  const [parentCategory, setParentCategory] = useState<CategoryT>(
    {} as CategoryT
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      icon: '',
    },

    validate: (values) => {
      const errors: any = {};
      if (!values.name) errors.name = 'Category name is required!';

      return errors;
    },

    onSubmit: async (values) => {
      const newData: any = {
        ...values,
      };
      if (parentCategory.name) {
        newData.parentId = parentCategory.id;
      } else {
        newData.parentId = null;
      }

      formik.setSubmitting(true);
      try {
        if (editItem?.id) {
          const { data } = await axios.put(
            `/product/category/${editItem.id}`,
            newData
          );
          data && dispatch(updateCategory(data));
          toast({
            message: 'category updated!',
          });
        } else {
          const { data } = await axios.post('/product/category', {
            ...newData,
            slug: slug_generator(values.name),
          });
          data && dispatch(addCategory(data));
          toast({
            message: 'new category added!',
          });
        }
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });
      } finally {
        openModal.setFalse();
        formik.setSubmitting(false);
        _finally && _finally();
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: editItem?.name || '',
      icon: editItem?.icon || '',
    });
  }, [editItem]);

  return (
    <MuiResponsiveDialog
      handleSubmit={formik.handleSubmit}
      title={editItem?.name ? 'Update Category' : 'Add New Category'}
      openModal={openModal}
      loading={formik.isSubmitting}
    >
      <div className="flex flex-col gap-6">
        <MuiTextField
          required
          id="name"
          label="Category Name"
          {...formik.getFieldProps('name')}
          touched={formik.touched.name}
          error={formik.errors.name}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="cicon">Category Icon</label>
          {formik.values.icon ? (
            <img className="w-10 rounded" src={formik.values.icon} alt="" />
          ) : null}
          <input
            title="Category Icon"
            type="file"
            onChange={onChangeSetURL((url: any) =>
              formik.setFieldValue('icon', url)
            )}
          />
        </div>

        <div>
          <Label>
            Parent Category <small>(optional)</small>
          </Label>
          <CategoriesSelector
            open={true}
            onChange={(c) => setParentCategory(c)}
            defaultValue={
              editItem?.parentId
                ? findCategory(editItem.parentId, categories)
                : undefined
            }
          />
        </div>
      </div>
    </MuiResponsiveDialog>
  );
}
