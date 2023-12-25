import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params?: any) => {
    const { data } = await axios_private.get(`/expense`, {
      params,
    });
    return data;
  }
);

export const fetchExpensesCategories = createAsyncThunk(
  'expenses/fetchExpensesCategories',
  async (params?: any) => {
    const { data } = await axios_private.get(`/expense-category`, {
      params,
    });
    return data;
  }
);
