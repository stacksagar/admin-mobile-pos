import { lazy } from 'react';

const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const EditProfile = lazy(() => import('../pages/EditProfile'));
const Users = lazy(() => import('../pages/Users/Users'));
const Moderators = lazy(() => import('../pages/Users/Moderators'));
const ModeratorPermissions = lazy(
  () => import('../pages/Users/ModeratorPermissions')
);

const AddAndEditProduct = lazy(
  () => import('../pages/Products/AddAndEditProduct')
);

const AddProductQuantity = lazy(
  () => import('../pages/Products/AddProductQuantity')
);

const ProductCategories = lazy(
  () => import('../pages/ProductsCategories/ProductCategories')
);
const Products = lazy(() => import('../pages/Products/Products'));
const StockOutProducts = lazy(
  () => import('../pages/Products/StockOutProducts')
);

const Suppliers = lazy(() => import('../pages/Suppliers/Suppliers'));
const Customers = lazy(() => import('../pages/Customers/Customers'));
const Payments = lazy(() => import('../pages/Payments/Payments'));
const Discounts = lazy(() => import('../pages/Discounts/Discounts'));

const Vats = lazy(() => import('../pages/Vats/Vats'));
const SalesAndReturn = lazy(
  () => import('../pages/SalesAndReturn/SalesAndReturn')
);
const Sales = lazy(() => import('../pages/Sales/Sales'));

const Expenses = lazy(() => import('../pages/Expenses/Expenses'));
const ExpensesCategories = lazy(
  () => import('../pages/ExpensesCategories/ExpensesCategories')
);

const Orders = lazy(() => import('../pages/Orders/Orders'));
const Pages = lazy(() => import('../pages/Pages/Pages'));
const AddEditPage = lazy(() => import('../pages/Pages/AddEditPage'));
const POS = lazy(() => import('../pages/POS/POS'));
const POSInvoice = lazy(() => import('../pages/POSInvoice/POSInvoice'));

const SupplierHistoryInvoice = lazy(
  () => import('../pages/SupplierHistoryInvoice/SupplierHistoryInvoice')
);

const SupplierHistories = lazy(
  () => import('../pages/SupplierHistories/SupplierHistories')
);

const Settings = lazy(() => import('../pages/Settings/Settings'));
const Warranties = lazy(() => import('../pages/Warranties/Warranties'));
const WarrantyInvoice = lazy(
  () => import('../pages/WarrantyInvoice/WarrantyInvoice')
);
const WarrantyPOS = lazy(() => import('../pages/WarrantyPOS/WarrantyPOS'));
const WarrantyDashboard = lazy(
  () => import('../pages/WarrantyDashboard/WarrantyDashboard')
);

const ChangePassword = lazy(
  () => import('../pages/Authentication/ChangePassword')
);
const BarcodePrint = lazy(() => import('../pages/BarcodePrint/BarcodePrint'));
const Brands = lazy(() => import('../pages/Brands/Brands'));

const admin_pages = {
  '/': Dashboard,
  'edit-profile': EditProfile,
  users: Users,
  moderators: Moderators,
  'moderators/permissions': ModeratorPermissions,
  products: Products,
  'stock-out-products': StockOutProducts,
  'add-product': AddAndEditProduct,
  'edit-product': AddAndEditProduct,
  'add-product-quantity': AddProductQuantity,
  pages: Pages,
  'add-page': AddEditPage,
  'edit-page': AddEditPage,
  'products-categories': ProductCategories,
  suppliers: Suppliers,
  customers: Customers,
  payments: Payments,
  discounts: Discounts,
  vats: Vats,
  sales: Sales,
  'sales-and-return': SalesAndReturn,
  expenses: Expenses,
  'expenses-categories': ExpensesCategories,
  orders: Orders,
  pos: POS,
  pos_invoice: POSInvoice,
  'supplier-purchase-history': SupplierHistories,
  'supplier-history-invoice': SupplierHistoryInvoice,
  'change-password': ChangePassword,
  settings: Settings,
  warranties: Warranties,
  'warranty-pos': WarrantyPOS,
  'warranty-invoice': WarrantyInvoice,
  'warranty-dashboard': WarrantyDashboard,
  'barcode-print': BarcodePrint,
  brands: Brands,
};

export default admin_pages;
