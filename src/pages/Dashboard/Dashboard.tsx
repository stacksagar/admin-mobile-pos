import { useDashboardData } from '../../context/dashboard';
import { useEffect } from 'react';
import useAxiosPrivate from '../../hooks/axios/useAxiosPrivate';
import DashboardCard from './DashboardCard';
import { motion } from 'framer-motion';

const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };

const fromTopMotion = { hidden: { opacity: 0, y: -20 }, visible };

const fromBottomMotion = {
  hidden: { opacity: 0, y: 10 },
  visible,
};

const Dashboard = () => {
  const { dashboardData, setDashboardData } = useDashboardData();
  const axios = useAxiosPrivate();

  useEffect(() => {
    let isMount = true;

    async function fetchData() {
      const { data } = await axios.get('/admin/dashboard');
      setDashboardData(data || {});
    }

    isMount && fetchData();

    return () => {
      isMount = false;
    };
  }, []);

  return (
    <div>
      <motion.div
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, transition: { duration: 1 } }}
        variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
        className="space-y-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.today_purchased}
              title="Today Purchased"
              icon="bangladeshi-taka-sign"
              bg="bg-blue-500"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.weekly_purchased}
              title="Weekly Purchased"
              icon="bangladeshi-taka-sign"
              bg="bg-blue-500"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.monthly_purchased}
              title="Monthly Purchased"
              icon="bangladeshi-taka-sign"
              bg="bg-blue-500"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.yearly_purchased}
              title="Yearly Purchased"
              icon="bangladeshi-taka-sign"
              bg="bg-blue-500"
              currency="৳"
            />
          </div>
          {/* <motion.div variants={fromTopMotion} className="xl:col-span-4">
            <DashboardCard
              to="/customers"
              value={dashboardData?.running_purchased}
              title="Running Purchase Stock"
              icon="bangladeshi-taka-sign"
              bg="bg-purple-600"
              currency="৳"
            />
          </motion.div> */}
          <motion.div variants={fromTopMotion} className="xl:col-span-4">
            <DashboardCard
              to="/customers"
              value={dashboardData?.total_purchased}
              title="All Purchase"
              icon="bangladeshi-taka-sign"
              bg="bg-purple-600"
              currency="৳"
            />
          </motion.div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.total_sales}
              title="Total Sales"
              icon="bangladeshi-taka-sign"
              bg="bg-rose-500"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.total_sales_profit}
              title="Total Sales Profit"
              icon="bangladeshi-taka-sign"
              bg="bg-rose-500"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/expenses"
              value={dashboardData?.total_expenses_amount}
              title="Total Expenses Amount"
              icon="bangladeshi-taka-sign"
              bg="bg-pink-700"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={
                dashboardData?.total_sales_profit -
                dashboardData?.total_expenses_amount
              }
              title="Total Profit"
              icon="bangladeshi-taka-sign"
              bg="bg-purple-600"
              currency="৳"
            />
          </div>
          <motion.div variants={fromTopMotion} className="xl:col-span-6">
            <DashboardCard
              to="/customers"
              value={dashboardData.total_customer_due}
              title="Total Customer Due"
              icon="bangladeshi-taka-sign"
              bg="bg-purple-600"
              currency="৳"
            />
          </motion.div>
          <motion.div variants={fromTopMotion} className="xl:col-span-6">
            <DashboardCard
              to="/products"
              value={dashboardData?.total_supplier_due}
              title="Total Supplier Due"
              icon="bangladeshi-taka-sign"
              bg="bg-cyan-700"
              currency="৳"
            />
          </motion.div>
          <motion.div variants={fromTopMotion} className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.today_sales}
              title="Today Sales"
              icon="bangladeshi-taka-sign"
              bg="bg-blue-500"
              currency="৳"
            />
          </motion.div>
          <motion.div variants={fromTopMotion} className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.today_sales_profit}
              title="Today Profit"
              icon="bangladeshi-taka-sign"
              bg="bg-blue-500"
              currency="৳"
            />
          </motion.div>
          <motion.div variants={fromTopMotion} className="xl:col-span-3">
            <DashboardCard
              to="/expenses"
              value={dashboardData?.today_expenses_amount}
              title="Today Expenses Amount"
              icon="bangladeshi-taka-sign"
              bg="bg-pink-500"
              currency="৳"
            />
          </motion.div>
          <motion.div variants={fromTopMotion} className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={
                dashboardData?.today_sales_profit -
                dashboardData?.today_expenses_amount
              }
              title="Today Profit"
              icon="bangladeshi-taka-sign"
              bg="bg-green-700"
              currency="৳"
            />
          </motion.div>
          <div className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.prev_monthly_sales}
              title="Prev Month Sales"
              icon="bangladeshi-taka-sign"
              bg="bg-cyan-700"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.prev_monthly_sales_profit}
              title="Prev Month Profit"
              icon="bangladeshi-taka-sign"
              bg="bg-cyan-700"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-3">
            <DashboardCard
              to="/expenses"
              value={dashboardData?.prev_month_expenses_amount}
              title="Prev Month Expenses Amount"
              icon="bangladeshi-taka-sign"
              bg="bg-yellow-700"
              currency="৳"
            />
          </div>
          <div className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={
                dashboardData?.prev_monthly_sales_profit -
                dashboardData?.prev_month_expenses_amount
              }
              title="Prev Month Profit"
              icon="bangladeshi-taka-sign"
              bg="bg-orange-500"
              currency="৳"
            />
          </div>
          <motion.div variants={fromBottomMotion} className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.monthly_sales}
              title="This Month Sales Amount"
              icon="bangladeshi-taka-sign"
              bg="bg-teal-600"
              currency="৳"
            />
          </motion.div>
          <motion.div variants={fromBottomMotion} className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.monthly_sales_profit}
              title="This Month Sales Profit"
              icon="bangladeshi-taka-sign"
              bg="bg-teal-600"
              currency="৳"
            />
          </motion.div>
          <motion.div variants={fromBottomMotion} className="xl:col-span-3">
            <DashboardCard
              to="/expenses"
              value={dashboardData?.this_month_expenses_amount}
              title="This Month Expenses Amount"
              icon="bangladeshi-taka-sign"
              bg="bg-purple-500"
              currency="৳"
            />
          </motion.div>
          <motion.div variants={fromBottomMotion} className="xl:col-span-3">
            <DashboardCard
              to="/sales-and-return"
              value={
                dashboardData?.monthly_sales_profit -
                dashboardData?.this_month_expenses_amount
              }
              title="This Month Profit"
              icon="bangladeshi-taka-sign"
              bg="bg-[#555555]"
              currency="৳"
            />
          </motion.div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/products"
              value={dashboardData?.total_products}
              title="Total Products"
              icon="tree"
              bg="bg-rose-600"
              currency=""
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/expenses"
              value={dashboardData?.total_expenses}
              title="Total Expenses"
              icon="e"
              bg="bg-amber-600"
              currency=""
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/suppliers"
              value={dashboardData?.total_suppliers}
              title="Total Suppliers"
              icon="users-viewfinder"
              bg="bg-blue-700"
              currency=""
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/brands"
              value={dashboardData?.total_brands}
              title="Total Brands"
              icon="b"
              bg="bg-pink-600"
              currency=""
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/customers"
              value={dashboardData?.total_customers}
              title="Total Customers"
              icon="users-viewfinder"
              bg="bg-indigo-600"
              currency=""
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/users"
              value={dashboardData?.total_users}
              title="Total Users"
              icon="users-viewfinder"
              bg="bg-fuchsia-600"
              currency=""
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.weekly_vat_amount}
              title="Weekly Vat"
              icon="percentage"
              bg="bg-orange-600"
              currency=""
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.monthly_vat_amount}
              title="Monthly Vat"
              icon="percentage"
              bg="bg-rose-600"
              currency=""
            />
          </div>
          <div className="xl:col-span-4">
            <DashboardCard
              to="/sales-and-return"
              value={dashboardData?.yearly_vat_amount}
              title="Yearly Vat"
              icon="percentage"
              bg="bg-red-600"
              currency=""
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
