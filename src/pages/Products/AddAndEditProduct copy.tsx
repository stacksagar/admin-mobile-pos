import { useEffect, useRef, useState } from 'react';
import SunEditor from '../../common/Editors/SunEditor';
import SunEditorCore from 'suneditor/src/lib/core';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import { useFormik } from 'formik';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import { Button, Checkbox, IconButton } from '@mui/material';
import Label from '../../common/Forms/Label';
import { uid } from 'uid';
import onChangeSetURL from '../../utils/onChangeSetURL';
import InputForUpload from '../../common/Forms/InputForUpload';
import FIcon from '../../common/Icons/FIcon';
import CategoriesSelector from '../ProductsCategories/CategoriesSelector/CategoriesSelector';
import { useAppDispatch, useAppSelector } from '../../app/store';
import useFetchDispatch from '../../hooks/redux/useFetchDispatch';
import {
  fetchStockInProducts,
  fetchProductsCategories,
} from '../../app/features/products/requests';
import { fetchSuppliers } from '../../app/features/suppliers/requests';
import useObject from '../../hooks/state/useObject';
import useSupplierFormik, {
  SupplierForms,
} from '../Suppliers/useSupplierFormik';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';

import {
  addProduct,
  updateProduct,
} from '../../app/features/products/stockInProductsSlice';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEditProductData } from './hooks/useEditProductData';
import useBoolean from '../../hooks/state/useBoolean';
import AddOrEditCategory from '../ProductsCategories/CategoriesSelector/AddOrEditCategory';
import { fetchModels } from '../../app/features/models/requests';
import { fetchBrands } from '../../app/features/brands/requests';
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import KeyValueForm from '../../common/Forms/KeyValueForm';
import { CategoryT, ProductVariant, SupplierT } from '../../data';
import MultipleVariants from '../../components/MultipleVariants/MultipleVariants';

export default function AddAndEditProduct() {
  const isEditPage = location.pathname.includes('edit-product');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { data: categories } = useAppSelector((s) => s.products_categories);
  const { data: suppliers } = useAppSelector((s) => s.suppliers);
  const { data: products } = useAppSelector((s) => s.products);
  const { data: models } = useAppSelector((s) => s.models);
  const { data: brands } = useAppSelector((s) => s.brands);

  const dispatch = useAppDispatch();
  const selectedSupplier = useObject<SupplierT>({} as SupplierT);
  const selectedCategory = useObject<CategoryT>({} as CategoryT);

  const openAddCategoryModal = useBoolean();

  useFetchDispatch({
    data: categories,
    fetchFunc: fetchProductsCategories,
  });

  useFetchDispatch({
    data: suppliers,
    fetchFunc: fetchSuppliers,
  });

  useFetchDispatch({
    data: products,
    fetchFunc: fetchStockInProducts,
  });

  useFetchDispatch({
    data: models,
    fetchFunc: fetchModels,
  });

  useFetchDispatch({
    data: brands,
    fetchFunc: fetchBrands,
  });

  const product_desc_editor = useRef<SunEditorCore>();
  const product_details_editor = useRef<SunEditorCore>();
  const [productImages, setProductImages] = useState<string[]>([]);

  const shFormik = useFormik({
    initialValues: {
      paid_amount: '',
      due_amount: '',
    },

    onSubmit() {},
  });

  const productFormik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      purchase_price: 0,
      sale_price: 0,
      in_stock: '',
      barcode: '',
      custom: {},
      brand: '',
      model: '',
      with_variant: false,
      variants: [] as ProductVariant[],
      //
      total_purchase_amount: 0,
      total_sale_amount: 0,
    },

    onSubmit: async (values) => {
      productFormik.setSubmitting(true);
      const productData: any = {
        ...values,
        images: productImages,
        description: product_desc_editor.current?.getContents(true),
        details: product_details_editor.current?.getContents(true),
        thumbnail: productImages[0],
      };

      if (selectedSupplier?.data?.id) {
        productData.supplierId = selectedSupplier?.data?.id;
      }

      try {
        if (isEditPage) {
          const { data } = await axios.put(
            `/product/${searchParams.get('id')}`,
            productData
          );
          data && dispatch(updateProduct(data));
          toast({ message: 'Product updated!' });
        } else {
          const { data } = await axios.post('/product', {
            ...productData,
            supplierInvoice: shFormik.values,
          });
          data && dispatch(addProduct(data));
          toast({ message: 'Added new product!' });
        }
        navigate('/products');
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });
      } finally {
      }
    },
  });

  function changeFormik(key: string, value: any) {
    productFormik.setFieldValue(key, value);
  }

  const { formik: supplierFormik } = useSupplierFormik({
    editItem: selectedSupplier.data,
    avoidUpdateToast: true,
    _onSuccessAdd(supplier: SupplierT) {
      productFormik.setFieldValue('supplierId', supplier.id);
    },
    _finally() {
      productFormik.handleSubmit();
    },
  });

  const { editProduct } = useEditProductData({
    productFormik,
    selectedSupplier,
    selectedCategory,
    setProductImages,
    product_desc_editor,
    product_details_editor,
  });

  useEffect(() => {
    const due_amount = Number(shFormik.values.due_amount);
    const total_purchase_amount = productFormik.values.total_purchase_amount;
    if (due_amount > total_purchase_amount) {
      shFormik.setFieldValue('due_amount', 0);
      return;
    }
    if (!due_amount) {
      shFormik.setFieldValue('paid_amount', total_purchase_amount);
      return;
    }
    shFormik.setFieldValue('paid_amount', total_purchase_amount - due_amount);
  }, [shFormik.values.due_amount]);

  // useEffect(() => {
  //   const paid_amount = Number(shFormik.values.paid_amount);
  //   const total_purchase_amount = productFormik.values.total_purchase_amount;

  //   if (paid_amount > total_purchase_amount) {
  //     shFormik.setFieldValue('paid_amount', 0);
  //     return;
  //   }

  //   shFormik.setFieldValue('due_amount', total_purchase_amount - paid_amount);
  // }, [shFormik.values.paid_amount]);

  useEffect(() => {
    let in_stock: number = 0;

    productFormik.setFieldValue('in_stock', in_stock);

    console.log('productFormik.values ', productFormik.values);
  }, [productFormik.values.variants]);

  return (
    <div>
      <AddOrEditCategory openModal={openAddCategoryModal} />

      <form
        onSubmit={supplierFormik.handleSubmit}
        className="grid gap-12 xl:grid-cols-12"
      >
        <div className="space-y-8 bg-white p-8 xl:col-span-8 dark:bg-black">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <div className="col-span-full">
              <h3 className="section_header">Product Details</h3>
            </div>

            <MuiTextField
              required
              id="name"
              label="Product Name"
              {...productFormik.getFieldProps('name')}
            />

            <MuiTextField
              id="barcode"
              label="Custom Barcode"
              {...productFormik.getFieldProps('barcode')}
            />
            <MuiSearchSelect
              label={
                selectedSupplier?.data?.supplier_name
                  ? 'Supplier'
                  : 'Select Supplier'
              }
              defaultTitle={selectedSupplier?.data?.supplier_name || null}
              options={suppliers}
              titleKey="supplier_name"
              onChange={selectedSupplier.set}
            />
            <div className="flex items-center gap-2">
              <div className="w-full">
                <CategoriesSelector
                  onChange={(c) => changeFormik('categoryId', c.id)}
                  defaultValue={selectedCategory.data}
                />
              </div>

              <IconButton
                onClick={openAddCategoryModal.setTrue}
                title="Add New Category"
                color="secondary"
              >
                <FIcon icon="plus" />
              </IconButton>
            </div>

            {productFormik?.values.with_variant ? null : (
              <>
                <MuiTextField
                  id="purchase_price"
                  label="Purchase Price (per unit)"
                  type="number"
                  {...productFormik.getFieldProps('purchase_price')}
                />

                <MuiTextField
                  id="sale_price"
                  label="Sale Price (per unit) "
                  type="number"
                  {...productFormik.getFieldProps('sale_price')}
                />
              </>
            )}

            <div>
              <MuiTextField
                id="in_stock"
                label="In Stock"
                type="number"
                {...productFormik.getFieldProps('in_stock')}
              />
              <div className="mt-1">
                <span>Total:</span>
                <b>
                  {(Number(productFormik.values.purchase_price) || 0) *
                    (Number(productFormik.values.in_stock) || 0) ||
                    productFormik.values.total_purchase_amount}
                </b>
              </div>
            </div>

            <div>
              <Label>Custom Properties</Label>
              <KeyValueForm
                keyTitle="Name"
                valueTitle="value"
                defaultValues={editProduct?.custom}
                onChange={(custom) => changeFormik('custom', custom)}
              />
            </div>

            <div className="flex cursor-pointer items-center gap-1 text-lg font-semibold">
              <label className="cursor-pointer" htmlFor="with_variants">
                With Variants
              </label>
              <Checkbox
                id="with_variants"
                checked={productFormik.values.with_variant}
                {...productFormik.getFieldProps('in_stock')}
                onChange={(e) =>
                  productFormik.setFieldValue('with_variant', e.target.checked)
                }
              />
            </div>

            {productFormik?.values?.with_variant ? (
              <div className="col-span-full">
                <MultipleVariants
                  onChange={(variants) =>
                    productFormik.setFieldValue('variants', variants)
                  }
                />
              </div>
            ) : null}

            <div className="col-span-full">
              <div className="p-2">
                <Label>Product Images</Label>
                <div className="flex flex-wrap gap-2">
                  {productImages?.map((image: any, index) => (
                    <div key={uid()} className="relative">
                      <button
                        title="remove"
                        onClick={() =>
                          setProductImages((p) =>
                            p.filter((_, i) => i !== index)
                          )
                        }
                        type="button"
                        className="absolute right-2 top-2 h-9 w-9 rounded-full bg-white text-red-700 focus:ring"
                      >
                        <FIcon icon="trash" />
                      </button>
                      <img
                        className="max-w-[200px]"
                        src={image}
                        alt="screenshot"
                      />
                    </div>
                  ))}
                </div>
                <InputForUpload
                  multiple={true}
                  onChange={onChangeSetURL((url: any) =>
                    setProductImages((p) => [...p, url])
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Product Details</Label>

            <SunEditor
              height="400px"
              placeholder="Product Details..."
              editor={product_details_editor}
            />
          </div>

          <div>
            <Label>Product Description</Label>

            <SunEditor
              height="400px"
              placeholder="Product Description..."
              editor={product_desc_editor}
            />
          </div>

          <div className="w-full">
            <Button type="submit" variant="contained" size="large">
              {isEditPage ? 'Update' : 'Submit'}
            </Button>
          </div>
        </div>

        <div className="h-fit space-y-8 bg-white p-8 xl:col-span-4 dark:bg-black">
          <h3 className="section_header">Supplier Details</h3>
          <SupplierForms formik={supplierFormik} />

          <br />

          {editProduct?.id ? null : (
            <div className="space-y-3">
              <h3 className="section_header">Supplier Invoice History</h3>
              {supplierFormik.values.supplier_name}
              <MuiTextField
                required
                type="number"
                id="name"
                label="Paid Amount"
                {...shFormik.getFieldProps('paid_amount')}
              />
              <MuiTextField
                required
                type="number"
                id="name"
                label="Due Amount"
                {...shFormik.getFieldProps('due_amount')}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
