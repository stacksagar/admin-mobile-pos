import { createContext, useContext, useState } from 'react';

export type Dashboard = 'dark' | 'light';

const counts = {
  total_products_categories: 0,
  total_expenses_categories: 0,
  total_products: 0,
  total_expenses: 0,
  total_suppliers: 0,
  total_brands: 0,
  total_customers: 0,
  total_users: 0,
  total_expenses_amount: 0,
  today_expenses_amount: 0,
  this_month_expenses_amount: 0,
  prev_month_expenses_amount: 0,
  today_due_amount: 0,
  this_month_due_amount: 0,
  prev_month_due_amount: 0,
  total_due_amount: 0,
  total_supplier_due: 0,
  total_customer_due: 0,
  today_purchased: 0,
  weekly_purchased: 0,
  monthly_purchased: 0,
  prev_monthly_purchased: 0,
  yearly_purchased: 0,
  total_purchased: 0,
  running_purchased: 0,
  today_sales: 0,
  weekly_sales: 0,
  monthly_sales: 0,
  prev_monthly_sales: 0,
  yearly_sales: 0,
  total_sales: 0,
  today_sales_profit: 0,
  weekly_sales_profit: 0,
  monthly_sales_profit: 0,
  prev_monthly_sales_profit: 0,
  yearly_sales_profit: 0,
  total_sales_profit: 0,
  weekly_vat_amount: 0,
  monthly_vat_amount: 0,
  yearly_vat_amount: 0,
};

type DashboardData = typeof counts;

interface Context {
  dashboardData: DashboardData;
  setDashboardData: React.Dispatch<React.SetStateAction<DashboardData>>;
}

const DashboardContext = createContext<Context>({} as Context);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState(counts);

  return (
    <DashboardContext.Provider value={{ dashboardData, setDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardData() {
  return useContext(DashboardContext);
}
