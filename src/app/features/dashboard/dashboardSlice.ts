import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardData } from "./requests";

interface State {
  data: {
    sales_categories?: number;
    sales?: number;
    admins?: number;
    users?: number;
    moderators?: number;
    customers?: number;
    expenses?: number;
    expenses_categories?: number;
    products?: number;
    products_categories?: number;
    total_sales_amount?: number;
    this_month_sales_amount?: number;
    total_expenses_amount?: number;
    total_dues_amount?: number;
    this_month_expenses_amount?: number;
    this_month_dues_amount?: number;

    previous_monthly_sales_amount?: number;
    previous_monthly_expense_amount?: number;
    yearly_sales_amount?: number;
    yearly_expense_amount?: number;
    monthly_due_amount?: number;
    yearly_due_amount?: number;
    previous_month_sales?: number;
    this_month_sales?: number;
    total_job_application?: number;
    total_pending_customers?: number;
  };

  loading: boolean;
  error: any;
}

const initialState: State = {
  data: {},
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // For fetch dashboard
    builder.addCase(fetchDashboardData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.dashboardData || {};
      state.error = null;
    });
    builder.addCase(fetchDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.data = {};
      state.error = action.error.message;
    });
  },
});

export default dashboardSlice;
