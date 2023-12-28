import { AnyAction, ThunkDispatch, configureStore } from '@reduxjs/toolkit';
import API_URL from '../api/api';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import userSlice from './features/users/userSlice';

import stockInProductsSlice from './features/products/stockInProductsSlice';
import categorySlice from './features/products/categorySlice';
import supplierSlice from './features/suppliers/supplierSlice';
import brandSlice from './features/brands/brandSlice';
import modelSlice from './features/models/modelSlice';
import vatSlice from './features/vats/vatSlice';
import discountSlice from './features/discounts/discountSlice';
import paymentSlice from './features/payments/paymentSlice';
import customerSlice from './features/customers/customerSlice';
import expenseSlice from './features/expenses/expenseSlice';
import expensesCategoriesSlice from './features/expenses/expensesCategoriesSlice';
import saleSlice from './features/sales/salesSlice';
import stockOutProductsSlice from './features/products/stockOutProductsSlice';
import orderSlice from './features/orders/orderSlice';
import pageSlice from './features/pages/pagesSlice';import warrantySlice from './features/warranties/warrantySlice';


export const store = configureStore({
  reducer: {
    users: userSlice.reducer,
    suppliers: supplierSlice.reducer,
    customers: customerSlice.reducer,
    products: stockInProductsSlice.reducer,
    stock_out_products: stockOutProductsSlice.reducer,
    products_categories: categorySlice.reducer,
    brands: brandSlice.reducer,
    models: modelSlice.reducer,
    payments: paymentSlice.reducer,
    discounts: discountSlice.reducer,
    vats: vatSlice.reducer,
    expenses: expenseSlice.reducer,
    expenses_categories: expensesCategoriesSlice.reducer,
    orders: orderSlice.reducer,
    sales: saleSlice.reducer,
    pages: pageSlice.reducer,
    warranties: warrantySlice.reducer,
  },

  devTools: API_URL.includes('localhost'),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;