import { createSlice } from '@reduxjs/toolkit';
import { fetchSales } from './requests';

interface State {
  data: Sale[];
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

const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addSale: (state, action) => {
      const data = action.payload;
      if (typeof data?.product === 'string') {
        data.product = JSON.parse(data?.product || '{}');
        state.data.unshift(data);
      } else {
        state.data.unshift(action.payload);
      }
    },

    updateSale: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeSale: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeSales: (state, action) => {
      state.data = state.data.filter(
        (sale) => !action.payload?.includes(sale.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch sales
    builder.addCase(fetchSales.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchSales.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.sales || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchSales.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addSale, removeSale, updateSale, removeSales } =
  saleSlice.actions;
export default saleSlice;
