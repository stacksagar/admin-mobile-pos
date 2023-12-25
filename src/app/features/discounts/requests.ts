import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchDiscounts = createAsyncThunk(
  'expenses/fetchDiscounts',
  async (params?: any) => {
    const { data } = await axios_private.get(`/discount`, {
      params,
    });
    return data;
  }
);
