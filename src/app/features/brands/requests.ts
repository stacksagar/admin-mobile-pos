import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchBrands = createAsyncThunk(
  'expenses/fetchBrands',
  async (params?: any) => {
    const { data } = await axios_private.get(`/brand`, {
      params,
    });
    return data;
  }
);
