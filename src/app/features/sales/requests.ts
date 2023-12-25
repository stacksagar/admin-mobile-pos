import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchSales = createAsyncThunk(
  'expenses/fetchSales',
  async (params?: any) => {
    const { data } = await axios_private.get(`/sale`, {
      params,
    });
    return data;
  }
);
