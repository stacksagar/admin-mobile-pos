import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchCustomers = createAsyncThunk(
  'expenses/fetchCustomers',
  async (params?: any) => {
    const { data } = await axios_private.get(`/customer`, {
      params,
    });
    return data;
  }
);
