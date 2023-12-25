import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchWarranties = createAsyncThunk(
  'expenses/fetchWarranties',
  async (params?: any) => {
    const { data } = await axios_private.get(`/warranty`, {
      params,
    });
    return data;
  }
);
