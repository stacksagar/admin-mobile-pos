import { createSlice } from '@reduxjs/toolkit';
import { fetchDiscounts } from './requests';

interface State {
  data: Discount[];
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

const discountSlice = createSlice({
  name: 'discounts',
  initialState,
  reducers: {
    addDiscount: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateDiscount: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeDiscount: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeDiscounts: (state, action) => {
      state.data = state.data.filter(
        (discount) => !action.payload?.includes(discount.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch discounts
    builder.addCase(fetchDiscounts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchDiscounts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.discounts || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchDiscounts.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addDiscount, removeDiscount, updateDiscount, removeDiscounts } =
  discountSlice.actions;
export default discountSlice;
