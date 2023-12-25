import { createSlice } from '@reduxjs/toolkit';
import { fetchWarranties } from './requests';
import  Warranty from '../../../types/data/Warranty';

interface State {
  data: Warranty[];
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

const warrantySlice = createSlice({
  name: 'warranties',
  initialState,
  reducers: {
    addWarranty: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateWarranty: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeWarranty: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeWarranties: (state, action) => {
      state.data = state.data.filter(
        (warranty) => !action.payload?.includes(warranty.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch warranties
    builder.addCase(fetchWarranties.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchWarranties.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.warranties || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchWarranties.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addWarranty, removeWarranty, updateWarranty, removeWarranties } =
  warrantySlice.actions;
export default warrantySlice;
