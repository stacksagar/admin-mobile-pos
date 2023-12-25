import { createSlice } from '@reduxjs/toolkit';
import { fetchExpensesCategories } from './requests';

interface State {
  data: ExpenseCategory[];
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

const expensesCategoriesSlice = createSlice({
  name: 'expensesCategories',
  initialState,
  reducers: {
    addExpenseCategory: (state, action) => {
      state.data.unshift(action.payload);
    },

    updateExpenseCategory: (state, action) => {
      const found = state.data.find((c) => c.id === action.payload?.id) || {};
      Object.assign(found, { ...action.payload });
    },

    removeExpenseCategory: (state, action) => {
      const index = state.data.findIndex((c) => c.id === action.payload);

      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    removeExpenseCategories: (state, action) => {
      state.data = state.data.filter(
        (expense) => !action.payload?.includes(expense.id)
      );
    },
  },

  extraReducers: (builder) => {
    // For fetch expensesCategories
    builder.addCase(fetchExpensesCategories.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchExpensesCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.categories || [];
      state.totalItems = action.payload?.totalItems;
      state.totalPages = action.payload?.totalPages;
      state.currentPage = action.payload?.currentPage;
      state.limit = action.payload?.limit;
      state.error = null;
    });

    builder.addCase(fetchExpensesCategories.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action.error.message;
    });
  },
});

export const { addExpenseCategory, removeExpenseCategory, updateExpenseCategory, removeExpenseCategories } =
  expensesCategoriesSlice.actions;
export default expensesCategoriesSlice;
