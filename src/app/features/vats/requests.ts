import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchVats = createAsyncThunk(
  'expenses/fetchVats',
  async (params?: any) => {
    const { data } = await axios_private.get(`/vat`, {
      params,
    });
    return data;
  }
);
