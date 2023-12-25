import { createSlice } from '@reduxjs/toolkit';
import { fetchOrders } from './requests';

interface State {
  data: Order[];
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

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateOrder: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeOrder: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeOrders: (state, action) => {
      state.data = state.data.filter(
        (order) => !action.payload?.includes(order.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.orders || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { removeOrder, updateOrder, removeOrders } = orderSlice.actions;
export default orderSlice;
