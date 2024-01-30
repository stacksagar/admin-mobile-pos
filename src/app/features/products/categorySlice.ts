import { createSlice } from '@reduxjs/toolkit';
import { fetchProductsCategories } from './requests';
import { CategoryT } from '../../../data';

interface State {
  data: CategoryT[];
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

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.data.push(action.payload);
    },
    updateCategory: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeCategory: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },
    removeCategories: (state, action) => {
      state.data = state.data.filter(
        (Category) => !action.payload?.includes(Category.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch categories
    builder.addCase(fetchProductsCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductsCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.categories || [];

      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });
    builder.addCase(fetchProductsCategories.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addCategory, removeCategory, updateCategory, removeCategories } =
  categorySlice.actions;
export default categorySlice;
