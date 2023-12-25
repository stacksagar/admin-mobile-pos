import { createSlice } from '@reduxjs/toolkit';
import { fetchPayments } from './requests';

interface State {
  data: Payment[];
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

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      state.data.unshift(action.payload);
    },

    updatePayment: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removePayment: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removePayments: (state, action) => {
      state.data = state.data.filter(
        (payment) => !action.payload?.includes(payment.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch payments
    builder.addCase(fetchPayments.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchPayments.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.payments || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchPayments.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addPayment, removePayment, updatePayment, removePayments } =
  paymentSlice.actions;
export default paymentSlice;
