import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchPayments = createAsyncThunk(
  'expenses/fetchPayments',
  async (params?: any) => {
    const { data } = await axios_private.get(`/payment`, {
      params,
    });
    return data;
  }
);
