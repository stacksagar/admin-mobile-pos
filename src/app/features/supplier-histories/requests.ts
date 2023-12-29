import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchSupplierHistories = createAsyncThunk(
  'supplier-history/fetchSupplierHistories',

  async (params?: any) => {
    const { data } = await axios_private.get(`/supplier-history/all/bypages`, {
      params,
    });

    return data;
  }
);
