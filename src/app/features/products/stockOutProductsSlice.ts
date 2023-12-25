import { createSlice } from '@reduxjs/toolkit';
import { fetchStockOutProducts } from './requests';

interface State {
  data: Product[];
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

const stockOutProductsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.data.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeProduct: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeProducts: (state, action) => {
      state.data = state.data.filter(
        (Product) => !action.payload?.includes(Product.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch products
    builder.addCase(fetchStockOutProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchStockOutProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.products || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });
    builder.addCase(fetchStockOutProducts.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addProduct, removeProduct, updateProduct, removeProducts } =
stockOutProductsSlice.actions;
export default stockOutProductsSlice;
