import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

import MuiSearchSelect from '../../common/MaterialUi/Forms/MuiSearchSelect';
import { BrandT, CategoryT, ProductT, UserT, WarrantyT } from '../../data';
import useCustomers from '../../hooks/react-query/useCustomers';
import useBoolean from '../../hooks/state/useBoolean';
import useObject from '../../hooks/state/useObject';
import FIcon from '../../common/Icons/FIcon';
import AddCustomerPopup from '../Customers/AddCustomerPopup';
import useProducts from '../../hooks/react-query/useProducts';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useBrands from '../../hooks/react-query/useBrands';
import AddBrandPopup from '../Brands/AddBrandPopup';
import CategoriesSelector from '../ProductsCategories/CategoriesSelector/CategoriesSelector';
import useString from '../../hooks/state/useString';
import AddOrEditCategory from '../ProductsCategories/CategoriesSelector/AddOrEditCategory';
import MuiTextField from '../../common/MaterialUi/Forms/MuiTextField';
import Label from '../../common/Forms/Label';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import Textarea from '../../common/Forms/Textarea';
import toast from '../../libs/toast';
import error_message from '../../utils/error_message';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import useNumber from '../../hooks/state/useNumber';

export default function WarrantyPOS() {
  const [params] = useSearchParams();
  const editId = useNumber();

  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const showAddCustomerPopup = useBoolean();
  const { customers, refetchCustomers } = useCustomers();
  const customer = useObject({} as UserT);

  const { products } = useProducts();
  const product = useObject({} as ProductT);

  const showAddBrandPopup = useBoolean();
  const { brands, refetchBrands } = useBrands();
  const brand = useObject({} as BrandT);

  const openAddCategoryModal = useBoolean();
  const category = useObject({} as CategoryT);

  const categoryId = useString('');

  const delivery_fee = useString('');
  const warranty_fee = useString('');
  const advance_amount = useString('');
  const due_amount = useString('');

  const formik = useFormik({
    initialValues: {
      receive_date: '',
      delivery_date: '',
      status: '',
      description: '',
    },

    onSubmit: async (values) => {
      const payableData = {
        ...values,
        customerId: customer?.data?.id,
        brandId: brand?.data?.id,
        productId: product?.data?.id,
        categoryId: Number(categoryId.value),

        delivery_fee: Number(delivery_fee.value || '0'),
        warranty_fee: Number(warranty_fee.value || '0'),
        advance_amount: Number(advance_amount.value || '0'),
        due_amount: Number(due_amount.value || '0'),
      };

      try {
        if (editId?.value) {
          const { data } = await axios.put(
            `/warranty/${editId.value}`,
            payableData
          );
          if (data) {
            navigate('/warranties');
            toast({ message: 'Warranty Added!' });
          }
        } else {
          const { data } = await axios.post('/warranty', payableData);
          if (data) {
            navigate('/warranties');
            toast({ message: 'Warranty Added!' });
          }
        }
      } catch (error) {
        toast({
          message: error_message(error),
          type: 'error',
        });
      }
    },
  });

  useEffect(() => {
    due_amount.setCustom(
      (
        Number(delivery_fee.value || '0') + Number(warranty_fee.value || '0')
      ).toString()
    );
  }, [delivery_fee.value, warranty_fee.value]);

  useEffect(() => {
    const id = params.get('id');
    if (!id) return;

    (async () => {
      const { data } = await axios.get<WarrantyT>(`/warranty/${id}`);
      if (!data?.id) return;
      editId.set(data.id);

      categoryId.setCustom(data.customerId?.toString());
      customer.set(data.customer);
      brand.set(data.brand);
      product.set(data.product);
      category.set(data.category);
      formik.setValues({
        receive_date: data?.receive_date,
        delivery_date: data?.delivery_date,
        status: data?.status,
        description: data?.description,
      });
      delivery_fee.setCustom(data?.delivery_fee?.toString());
      warranty_fee.setCustom(data?.warranty_fee?.toString());
      advance_amount.setCustom(data?.advance_amount?.toString());
      due_amount.setCustom(data?.due_amount?.toString());
    })();
  }, [params]);

  console.log(formik.values);

  return (
    <div className="grid grid-cols-1 gap-8 bg-white p-5 lg:grid-cols-2">
      <AddOrEditCategory openModal={openAddCategoryModal} />

      <div className="flex items-center gap-2">
        <AddCustomerPopup
          openModal={showAddCustomerPopup}
          _finally={refetchCustomers}
        />

        <MuiSearchSelect
          label={'Select Customer'}
          defaultTitle={customer?.data?.name || null}
          options={
            customers?.map((c) => ({
              ...c,
              key: `${c?.name} - ${c?.phone || c?.email}`,
            })) || []
          }
          titleKey="key"
          onChange={customer.set}
        />

        <IconButton onClick={showAddCustomerPopup.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <AddBrandPopup openModal={showAddBrandPopup} _finally={refetchBrands} />

        <MuiSearchSelect
          label={'Select Brand'}
          defaultTitle={brand?.data?.name || null}
          options={brands || []}
          titleKey="name"
          onChange={brand.set}
        />

        <IconButton onClick={showAddBrandPopup.setTrue}>
          <FIcon icon="plus" />
        </IconButton>
      </div>

      <div className="mt-2 flex items-center gap-1">
        <div className="w-full">
          <CategoriesSelector
            onChange={(c) => categoryId.setCustom(c?.id?.toString() || '')}
            defaultValue={category.data}
            shouldRefetch={openAddCategoryModal.true}
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

      <div className="flex items-center gap-2">
        <MuiSearchSelect
          label={'Select Product'}
          defaultTitle={product?.data?.name}
          options={products?.map((p) => ({
            ...p,
            uid: `${p.name} (${p?.barcode})`,
          }))}
          titleKey="uid"
          onChange={product.set}
        />

        <Link to="/add-product">
          <IconButton>
            <FIcon icon="plus" />
          </IconButton>
        </Link>
      </div>

      <div>
        <Label>Receive Date</Label>
        <MuiTextField
          type="date"
          placeholder="Receive Date"
          {...formik.getFieldProps('receive_date')}
        />
      </div>
      <div>
        <Label>Delivery Date</Label>
        <MuiTextField
          type="date"
          placeholder="Delivery Date"
          {...formik.getFieldProps('delivery_date')}
        />
      </div>

      <MuiTextField
        label="Delivery Fee"
        value={delivery_fee.value}
        onChange={delivery_fee.changeOnlyNumber}
      />
      <MuiTextField
        label="Warranty Fee"
        value={warranty_fee.value}
        onChange={warranty_fee.changeOnlyNumber}
      />
      <MuiTextField
        label="Advance Amount"
        value={advance_amount.value}
        onChange={advance_amount.changeOnlyNumber}
      />
      <MuiTextField
        label="Due Amount"
        value={due_amount.value}
        onChange={due_amount.changeOnlyNumber}
      />
      <div className="w-full space-y-8">
        <FormControl fullWidth>
          <InputLabel id="status">Select Status</InputLabel>
          <Select
            labelId="status"
            id="status"
            label="Status"
            {...formik.getFieldProps('status')}
          >
            <MenuItem value="received"> Received </MenuItem>
            <MenuItem value="delivery"> Delivery </MenuItem>
            <MenuItem value="success"> Success </MenuItem>
            <MenuItem value="courier"> Courier </MenuItem>
          </Select>
        </FormControl>
        <div className="w-full">
          <Button
            onClick={() => formik.handleSubmit()}
            variant="contained"
            className="w-full"
            size="large"
          >
            {editId?.value ? 'Update Warranty' : 'Create Warranty'}
          </Button>
        </div>
      </div>

      <Textarea
        placeholder="Description"
        {...formik.getFieldProps('description')}
      ></Textarea>
    </div>
  );
}
