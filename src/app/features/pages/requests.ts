import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (params?: any) => {
    const { data } = await axios_private.get(`/page`, {
      params,
    });
    return data;
  }
);
