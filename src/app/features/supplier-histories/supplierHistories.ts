import { createSlice } from '@reduxjs/toolkit';
import { fetchSupplierHistories } from './requests';
import { SupplierHistoryT } from '../../../data';

interface State {
  data: SupplierHistoryT[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  limit: number;
  loading: boolean;
  error: any;
}

const initialState: State = {
  data: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
  limit: 0,
};

const supplierHistories = createSlice({
  name: 'supplier_histories',
  initialState,
  reducers: {
    addHistory: (state, action) => {
      state.data.unshift(action.payload);
    },
    updateHistory: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeHistory: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeHistories: (state, action) => {
      state.data = state.data.filter(
        (History) => !action.payload?.includes(History.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch supplier_histories
    builder.addCase(fetchSupplierHistories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSupplierHistories.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.items || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });
    builder.addCase(fetchSupplierHistories.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addHistory, removeHistory, updateHistory, removeHistories } =
  supplierHistories.actions;
export default supplierHistories;
