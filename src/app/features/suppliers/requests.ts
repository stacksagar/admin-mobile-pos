import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchSuppliers = createAsyncThunk(
  'expenses/fetchSuppliers',
  async (params?: any) => {
    const { data } = await axios_private.get(`/supplier/all/bypages`, {
      params,
    });
    return data;
  }
);
