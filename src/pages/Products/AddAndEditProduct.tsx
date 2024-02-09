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
import { useAppDispatch } from '../../app/store';

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
import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import KeyValueForm from '../../common/Forms/KeyValueForm';
import { BrandT, CategoryT, ProductVariant, SupplierT, VatT } from '../../data';
import MultipleVariants from '../../components/MultipleVariants/MultipleVariants';
import { useAuth } from '../../context/auth';
import useSuppliers from '../../hooks/react-query/useSuppliers';
import useBrands from '../../hooks/react-query/useBrands';
import AddBrandPopup from '../Brands/AddBrandPopup';
import AddEditSupplierPopup from '../Suppliers/AddEditSupplierPopup';
import AddVatPopup from '../Vats/AddVatPopup';
import useVats from '../../hooks/react-query/useVats';
import { getVat } from '../POS/functions';

export default function AddAndEditProduct() {
  const { auth } = useAuth();
  const isEditPage = location.pathname.includes('edit-product');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const { suppliers, refetchSuppliers } = useSuppliers();
  const { brands, refetchBrands } = useBrands();
  const { vats, refetchVats } = useVats();

  const dispatch = useAppDispatch();
  const selectedBrand = useObject<BrandT>({} as BrandT);
  const selectedSupplier = useObject<SupplierT>({} as SupplierT);
  const selectedCategory = useObject<CategoryT>({} as CategoryT);
  const selectedVat = useObject<VatT>({} as VatT);

  const openAddCategoryModal = useBoolean();
  const showAddBrandPopup = useBoolean();
  const showAddVatPopup = useBoolean();

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
      purchase_price: '',
      sale_price: '',
      in_stock: '',
      barcode: '',
      custom: {},
      brand: '',
      model: '',
      with_variant: false,
      variants: [] as ProductVariant[],

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
        adminId: auth?.user?.id,
      };

      if (selectedSupplier?.data?.id) {
        productData.supplierId = selectedSupplier?.data?.id;
      }

      if (selectedBrand?.data?.id) {
        productData.brandId = selectedBrand?.data.id;
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
            supplierInvoice: {
              ...shFormik.values,
              quantity: productFormik.values.in_stock,
            },
          });

          axios.post('/tax', {
            name: `Purchase ${productFormik.values.name}`,
            value: getVat(
              productFormik.values.total_purchase_amount,
              selectedVat.data
            ),
            description: `purchase ${values.name} ${values.in_stock} pc. from ${selectedSupplier.data?.supplier_name} - ${selectedSupplier?.data?.email}`,
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
    avoidCreateSupplier:
      isEditPage || selectedSupplier?.data?.id ? true : false,
    due_amount: Number(shFormik.values.due_amount),
    paid_amount: Number(shFormik.values.paid_amount),
    editItem: selectedSupplier.data,
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
    if (!productFormik.values.with_variant) return;

    let in_stock: number = 0;
    let total_purchase_amount: number = 0;
    let total_sale_amount: number = 0;

    productFormik.values?.variants?.map((variant) => {
      Object.values(variant?.imeis).map((imeis) => {
        in_stock += imeis?.length;
        total_purchase_amount += variant.purchase_price * imeis?.length;
        total_sale_amount += variant.sale_price * imeis?.length;
      });
    });

    productFormik.setFieldValue('in_stock', in_stock);
    productFormik.setFieldValue('total_purchase_amount', total_purchase_amount);
    productFormik.setFieldValue('total_sale_amount', total_sale_amount);
    shFormik.setFieldValue('paid_amount', total_purchase_amount);

    productFormik.setFieldValue(
      'purchase_price',
      total_purchase_amount / in_stock
    );

    productFormik.setFieldValue('sale_price', total_sale_amount / in_stock);
  }, [productFormik.values.variants]);

  useEffect(() => {
    if (productFormik?.values.with_variant) return;

    const sale_price = productFormik.values.sale_price || 0;
    const purchase_price = productFormik.values.purchase_price || 0;
    const in_stock = productFormik.values.in_stock || 0;
    const total_purchase_amount = Number(purchase_price) * Number(in_stock);
    const total_sale_amount = Number(sale_price) * Number(in_stock);

    shFormik.setFieldValue('paid_amount', total_purchase_amount);
    productFormik.setFieldValue('total_purchase_amount', total_purchase_amount);
    productFormik.setFieldValue('total_sale_amount', total_sale_amount);
  }, [
    productFormik.values.purchase_price,
    productFormik.values.sale_price,
    productFormik.values.in_stock,
  ]);

  useEffect(() => {
    const due_amount = Number(shFormik.values.due_amount || '0');
    const total_purchase = productFormik.values.total_purchase_amount || 0;
    if (
      due_amount < 0 ||
      due_amount > productFormik.values.total_purchase_amount
    ) {
      shFormik.setFieldValue('due_amount', '');
      return;
    }

    shFormik.setFieldValue('paid_amount', total_purchase - due_amount);
  }, [shFormik.values.due_amount]);

  useEffect(() => {
    const paid_amount = Number(shFormik.values.paid_amount || '0');
    const total_purchase = productFormik.values.total_purchase_amount || 0;

    if (
      paid_amount < 0 ||
      paid_amount > productFormik.values.total_purchase_amount
    ) {
      shFormik.setFieldValue('paid_amount', '');
      return;
    }

    shFormik.setFieldValue('due_amount', total_purchase - paid_amount);
  }, [shFormik.values.paid_amount]);

  const [previousImeis, setPrevIMEIs] = useState([] as string[]);

  useEffect(() => {
    editProduct?.variants?.map((v) => {
      Object.values(v.imeis).map((imeis) => {
        setPrevIMEIs((p) => [...p, ...imeis]);
      });
    });
  }, [editProduct]);

  const showAddSupplierPopup = useBoolean();
  useEffect(() => {
    refetchSuppliers();
  }, [showAddSupplierPopup.true]);

  return (
    <div>
      <AddOrEditCategory openModal={openAddCategoryModal} />
      <AddEditSupplierPopup openModal={showAddSupplierPopup} />

      <form
        onSubmit={supplierFormik.handleSubmit}
        className="flex flex-col gap-12 xl:flex-row"
      >
        <div className="w-full space-y-8 bg-white p-8 dark:bg-black">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <div className="col-span-full">
              <h3 className="section_header">Product Details</h3>
            </div>

            {isEditPage ? null : (
              <div className="col-span-full flex cursor-pointer items-center gap-1 text-lg font-semibold">
                <label className="cursor-pointer" htmlFor="with_variants">
                  With Variants
                </label>
                <Checkbox
                  id="with_variants"
                  checked={productFormik.values.with_variant}
                  {...productFormik.getFieldProps('in_stock')}
                  onChange={(e) =>
                    productFormik.setFieldValue(
                      'with_variant',
                      e.target.checked
                    )
                  }
                />
              </div>
            )}
            <MuiTextField
              required
              id="name"
              label="Product Name"
              {...productFormik.getFieldProps('name')}
            />

            <MuiTextField
              id="barcode"
              disabled={productFormik.values.with_variant}
              label="Custom Barcode"
              {...productFormik.getFieldProps('barcode')}
            />

            {editProduct?.id ? null : (
              <div className="flex items-center gap-2">
                <MuiSearchSelect
                  label={
                    selectedSupplier?.data?.supplier_name
                      ? 'Supplier'
                      : 'Select Supplier'
                  }
                  defaultTitle={selectedSupplier?.data?.supplier_name || null}
                  options={suppliers || []}
                  titleKey="supplier_name"
                  onChange={selectedSupplier.set}
                />
                <Button
                  onClick={showAddSupplierPopup.toggle}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            )}

            {editProduct?.id ? null : (
              <div className="flex items-center gap-2">
                <AddBrandPopup
                  openModal={showAddBrandPopup}
                  _finally={refetchBrands}
                />
                <MuiSearchSelect
                  label={selectedBrand?.data?.name ? 'Brand' : 'Select Brand'}
                  defaultTitle={selectedBrand?.data?.name || null}
                  options={brands || []}
                  titleKey="name"
                  onChange={selectedBrand.set}
                />
                <IconButton onClick={showAddBrandPopup.setTrue}>
                  <FIcon icon="plus" />
                </IconButton>
              </div>
            )}

            {editProduct?.id ? null : (
              <div className="flex items-center gap-2">
                <AddVatPopup
                  openModal={showAddVatPopup}
                  _finally={refetchVats}
                />
                <MuiSearchSelect
                  label={selectedVat?.data?.name ? 'Vat' : 'Select Vat'}
                  defaultTitle={
                    selectedVat?.data?.name
                      ? `${selectedVat?.data?.name} ${
                          selectedVat?.data?.value
                        }${selectedVat?.data?.type === 'percentage' ? '%' : ''}`
                      : null
                  }
                  options={vats?.map((d) => ({
                    ...d,
                    key: `${d.name} ${d?.value}${
                      d?.type === 'percentage' ? '%' : ''
                    }`,
                  }))}
                  titleKey="key"
                  onChange={selectedVat.set}
                />
                <IconButton onClick={showAddVatPopup.setTrue}>
                  <FIcon icon="plus" />
                </IconButton>
              </div>
            )}

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
                disabled={isEditPage || productFormik?.values?.with_variant}
                id="in_stock"
                label="In Stock"
                type="number"
                {...productFormik.getFieldProps('in_stock')}
              />

              {productFormik?.values?.with_variant ? null : (
                <div className="mt-1">
                  <span>Total Purchase:</span>
                  <b>
                    {(Number(productFormik.values.purchase_price) || 0) *
                      (Number(productFormik.values.in_stock) || 0) ||
                      productFormik.values.total_purchase_amount}
                  </b>
                </div>
              )}
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

            {productFormik?.values?.with_variant ? (
              <div className="col-span-full">
                <MultipleVariants
                  isEditPage={isEditPage}
                  previousImeis={isEditPage ? previousImeis || [] : []}
                  defaultVariants={editProduct.variants}
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

        {editProduct?.id ? null : (
          <div className="h-fit w-full space-y-8 bg-white p-8 dark:bg-black xl:w-2/6">
            <h3 className="section_header">Supplier Details</h3>
            <SupplierForms disabledAmount formik={supplierFormik} />

            <br />

            {editProduct?.id ? null : (
              <div className="space-y-3">
                <h3 className="section_header">Supplier Invoice History</h3>

                <div className="py-2 text-lg font-semibold">
                  Vat:
                  {getVat(
                    productFormik.values.total_purchase_amount,
                    selectedVat.data
                  ) || 0}
                </div>

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
        )}
      </form>
    </div>
  );
}
