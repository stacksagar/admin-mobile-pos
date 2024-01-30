import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchStockInProducts = createAsyncThunk(
  'products/fetchStockInProducts',
  async (params?: any) => {
    const { data } = await axios_private.get(`/product/stock-in`, {
      params,
    });
    return data;
  }
);

export const fetchStockOutProducts = createAsyncThunk(
  'products/fetchStockOutProducts',
  async (params?: any) => {
    const { data } = await axios_private.get(`/product/stock-out`, {
      params,
    });
    return data;
  }
);

export const fetchProductsCategories = createAsyncThunk(
  'products/fetchProductsCategories',
  async (params?: any) => {
    const { data } = await axios_private.get(`/product/category/all`, {
      params,
    });
    return data;
  }
);
