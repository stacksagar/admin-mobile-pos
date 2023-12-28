import SunEditorCore from 'suneditor/src/lib/core';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UseObject } from '../../../hooks/state/useObject';
import useAxiosPrivate from '../../../hooks/axios/useAxiosPrivate';
import { ProductT } from '../../../data';

type Props = {
  productFormik: any;
  selectedSupplier: Omit<UseObject, 'set'>;
  selectedCategory: Omit<UseObject, 'set'>;
  setProductImages: React.Dispatch<React.SetStateAction<string[]>>;
  product_desc_editor: React.MutableRefObject<SunEditorCore | undefined>;
  product_details_editor: React.MutableRefObject<SunEditorCore | undefined>;
};

export function useEditProductData({
  productFormik,
  selectedSupplier,
  selectedCategory,
  setProductImages,
  product_desc_editor,
  product_details_editor,
}: Props) {
  const axios = useAxiosPrivate();
  const isEditPage = location.pathname.includes('edit-product');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [editProduct, setEditProduct] = useState<ProductT>({} as ProductT);

  useEffect(() => {
    if (!isEditPage) return;

    const editID = searchParams.get('id');

    if (!editID) return navigate('/products');

    axios.get(`/product/${editID}`).then((res) => {
      const product: ProductT = res?.data;
      if (!product?.id) return navigate('/products');
      setEditProduct(product);
      selectedSupplier.setCustom(product?.supplier);
      selectedCategory.setCustom(product?.category);
      setProductImages(product?.images || []);
      product_desc_editor.current?.setContents(product?.description || '');
      product_details_editor.current?.setContents(product?.details || '');
      productFormik.setFieldValue('name', product?.name);
      productFormik.setFieldValue('slug', product?.slug);
      productFormik.setFieldValue('purchase_price', product?.purchase_price);
      productFormik.setFieldValue('sale_price', product?.sale_price);
      productFormik.setFieldValue('in_stock', product?.in_stock);
      productFormik.setFieldValue('barcode', product?.barcode);
      productFormik.setFieldValue('brand', product?.brand);
      productFormik.setFieldValue('model', product?.model);
      productFormik.setFieldValue('categoryId', product?.categoryId);
      productFormik.setFieldValue('supplierId', product?.supplierId);

      productFormik.setFieldValue('with_variant', product?.with_variant);
      productFormik.setFieldValue('total_purchase_amount', product?.total_purchase_amount);
      productFormik.setFieldValue('total_sale_amount', product?.total_sale_amount);
      productFormik.setFieldValue('variants', product?.variants);
    });
  }, [searchParams]);

  return { editProduct };
}
