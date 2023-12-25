import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchModels = createAsyncThunk(
  'expenses/fetchModels',
  async (params?: any) => {
    const { data } = await axios_private.get(`/model`, {
      params,
    });
    return data;
  }
);
