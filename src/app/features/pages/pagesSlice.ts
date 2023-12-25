import { createSlice } from '@reduxjs/toolkit';
import { fetchPages } from './requests';

interface State {
  data: Page[];
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

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    addPage: (state, action) => {
      state.data.unshift(action.payload);
    },
    updatePage: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removePage: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removePages: (state, action) => {
      state.data = state.data.filter(
        (Page) => !action.payload?.includes(Page.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch pages
    builder.addCase(fetchPages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPages.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.pages || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });
    builder.addCase(fetchPages.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addPage, removePage, updatePage, removePages } =
  pageSlice.actions;
export default pageSlice;
