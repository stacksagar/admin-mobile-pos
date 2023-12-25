import { createAsyncThunk } from '@reduxjs/toolkit';
import { axios_private } from '../../../api/api';

export const fetchUsers = createAsyncThunk(
  'expenses/fetchUsers',
  async (params?: any) => {
    const { data } = await axios_private.get(`/auth/users`, {
      params,
    });
    return data;
  }
);
