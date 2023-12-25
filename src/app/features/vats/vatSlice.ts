import { createSlice } from '@reduxjs/toolkit';
import { fetchVats } from './requests';

interface State {
  data: Vat[];
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

const vatSlice = createSlice({
  name: 'vats',
  initialState,
  reducers: {
    addVat: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateVat: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeVat: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeVats: (state, action) => {
      state.data = state.data.filter(
        (vat) => !action.payload?.includes(vat.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch vats
    builder.addCase(fetchVats.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchVats.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.vats || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchVats.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addVat, removeVat, updateVat, removeVats } = vatSlice.actions;
export default vatSlice;
