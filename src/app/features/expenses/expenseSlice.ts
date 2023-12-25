import { createSlice } from '@reduxjs/toolkit';
import { fetchExpenses } from './requests';

interface State {
  data: Expense[];
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

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateExpense: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeExpense: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeExpenses: (state, action) => {
      state.data = state.data.filter(
        (expense) => !action.payload?.includes(expense.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch expenses
    builder.addCase(fetchExpenses.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.expenses || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchExpenses.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addExpense, removeExpense, updateExpense, removeExpenses } =
  expenseSlice.actions;
export default expenseSlice;
