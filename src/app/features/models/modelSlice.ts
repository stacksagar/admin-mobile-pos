import { createSlice } from '@reduxjs/toolkit';
import { fetchModels } from './requests';

interface State {
  data: Model[];
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

const modelSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    addModel: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateModel: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeModel: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeModels: (state, action) => {
      state.data = state.data.filter(
        (model) => !action.payload?.includes(model.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch models
    builder.addCase(fetchModels.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchModels.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.models|| [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchModels.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addModel, removeModel, updateModel, removeModels } =
  modelSlice.actions;
export default modelSlice;
