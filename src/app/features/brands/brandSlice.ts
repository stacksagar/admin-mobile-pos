import { createSlice } from '@reduxjs/toolkit';
import { fetchBrands } from './requests';

interface State {
  data: Brand[];
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

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    addBrand: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateBrand: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeBrand: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeBrands: (state, action) => {
      state.data = state.data.filter(
        (brand) => !action.payload?.includes(brand.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch brands
    builder.addCase(fetchBrands.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchBrands.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.brands || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchBrands.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addBrand, removeBrand, updateBrand, removeBrands } =
  brandSlice.actions;
export default brandSlice;
