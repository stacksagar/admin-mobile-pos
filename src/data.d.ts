export type Roles = 'user' | 'custom' | 'moderator' | 'admin';
type OrderStatus = 'processing' | 'delivered' | 'canceled';

export type SingleVariant = {
  color?: string;
  imei?: string;
  ram?: string;
  rom?: string;
  processor?: string;
  price: number;
};

interface KeyValuePair {
  [key: string]: any;
}

interface Common {
  id?: number;
  sl?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface WarrantyT extends Common {
  name: string;
}

interface BrandT extends Common {
  name: string;
}

interface DiscountT extends Common {
  name?: string;
  value: number;
  type: 'amount' | 'percentage';
}

interface VatT extends Common {
  name: string;
  value: number;
  type: 'amount' | 'percentage';
}

interface ExpenseT extends Common {
  name?: string;
  category?: string;
  cost?: number;
  date?: string;
  createdAt: string;
}

interface PaymentT extends Common {
  name: string;
  wallet?: string;
  logo?: string;
  description?: string;
}

interface SaleT extends Common {
  due: number;
  paid: number;
  discount: number;
  vat: number;
  quantity: number;
  total: number;
  method: string;
  with_variant?: boolean;
  properties?: {
    processor?: string;
    ram?: string;
    rom?: string;
    imei?: string;
    color?: string;
  };
  product?: ProductT;
  customer?: UserT;
  productId?: number;
  customerId?: number;
}

interface SupplierT extends Common {
  supplier_name?: string;
  company_name?: string;
  address?: string;
  phone?: string;
  nid?: string;
  email?: string;
  total_puchase_amount?: number | string;
  total_paid?: number | string;
  total_due?: number | string;
  products?: ProductT[];
}

export interface SupplierHistoryT extends Common {
  paid_amount: number;
  due_amount: number;
  supplierId: number;
  userId?: number;
  productId: number;
  user: UserT;
  supplier: SupplierT;
  product: ProductT;
  total_purchase_amount: number;
  quantity: number;
}

interface UserT extends Common {
  role: Roles;

  name: string;
  email?: string;
  phone?: string;

  password?: string;
  picture?: string;
  address?: string;
  nid?: any;
  permissions?: any;
  due?: number;
  paid?: number;
  total_puchase_amount?: number;
  refresh_token?: string;
  is_customer?: boolean;

  histories?: SellHistoryT[];
  purchase_histories?: SupplierHistoryT[];
}

export interface SellHistoryT extends Common {
  paid: number;
  due: number;
  total: number;
  quantity: number;

  productId?: number;
  customerId?: number;
  product?: ProductT;
  user?: UserT;
}

interface CategoryT extends Common {
  name: string;
  slug: string;
  icon?: string;
  parentId?: number;
  children?: CategoryT[];
}

interface ProductT extends Common {
  name: string;
  slug: string;
  sale_price: number;
  purchase_price: number;
  total_sale: number;
  in_stock: number;
  thumbnail: string;
  barcode?: string;
  brand?: string;
  model?: string;
  images?: string[];
  categoryId?: number;
  supplierId?: number;
  details?: string;
  description?: string;
  category?: CategoryT;
  supplier: SupplierT;
  variants?: ProductVariant[];
  custom?: KeyValuePair;
  with_variant?: boolean;
  total_purchase_amount: number;
  total_sale_amount: number;
}

interface ProductVariant {
  uid: string;
  processor: string;
  ram: string;
  rom: string;
  purchase_price: number;
  sale_price: number;
  imeis: {
    [colorName: string]: string[];
  };
}

interface PageT extends Common {
  name: string;
  slug: string;
  content: string;
  thumbnail: string;
}

interface SettingT extends Common {
  client: {
    site_title?: string;
    favicon?: string;
    header_logo?: string;
    footer_logo?: string;
    footer_description?: string;

    meta_keywords?: string;
    meta_description?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
    phone?: string;
    email?: string;
    location?: string;
    copyright?: string;
    smtp_host?: string;
    smtp_port?: string;
    smtp_user?: string;
    smtp_password?: string;
    smtp_from?: string;

    product_banner?: string;
    banner_width?: 'full' | '';
    service_banner?: string;
    product_banner_link?: string;
    service_banner_link?: string;

    popup_image?: string;
    popup_link?: string;
    popup_on?: 'on' | 'off';
    currency: string;

    invoice_title?: string;
    invoice_logo?: string;
    invoice_address?: string;
    invoice_phone?: string;
    invoice_email?: string;
    invoice_website?: string;
    invoice_sign?: string;

    banners?: { img: string; link: string }[];
    header_links?: {
      [key: string]: string;
    };

    // colors
    header_bg?: string;
    header_text?: string;
    sub_header_bg?: string;
    sub_header_text?: string;
    footer_bg?: string;
    footer_text?: string;
    map?: string;
    messenger_chat_code?: string;

    facebook_app_id?: string;
    facebook_page_id?: string;
  };
  admin: {};
}

export interface BarcodeT extends Common {
  with_multi?: boolean;
  barcode?: string;
  barcodes?: {
    color: string;
    ram: string;
    rom: string;
    imei: string;
    processor: string;
    price: number;
  }[];

  quantity?: number;
  productId?: number;
  product?: ProductT;
}

export interface VatT extends Common {
  name: string;
  value: number;
  type: 'amount' | 'percentage';
}

export interface DiscountT extends Common {
  name: string;
  value: number;
  type: 'amount' | 'percentage';
}
