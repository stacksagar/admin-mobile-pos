import { createSlice } from '@reduxjs/toolkit';
import { fetchCustomers } from './requests';

interface State {
  data: Customer[];
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

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateCustomer: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeCustomer: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeCustomers: (state, action) => {
      state.data = state.data.filter(
        (customer) => !action.payload?.includes(customer.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch customers
    builder.addCase(fetchCustomers.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.customers || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addCustomer, removeCustomer, updateCustomer, removeCustomers } =
  customerSlice.actions;
export default customerSlice;
