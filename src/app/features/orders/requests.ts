import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params?: any) => {
    const { data } = await axios_private.get(`/order`, {
      params,
    });
    return data;
  }
);
