import { createSlice } from '@reduxjs/toolkit';
import { fetchSuppliers } from './requests';

interface State {
  data: Supplier[];
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

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    addSupplier: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateSupplier: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeSupplier: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeSuppliers: (state, action) => {
      state.data = state.data.filter(
        (supplier) => !action.payload?.includes(supplier.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch suppliers
    builder.addCase(fetchSuppliers.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchSuppliers.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.items || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchSuppliers.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addSupplier, removeSupplier, updateSupplier, removeSuppliers } =
  supplierSlice.actions;
export default supplierSlice;
