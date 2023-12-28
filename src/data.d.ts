type Roles = 'user' | 'custom' | 'moderator' | 'admin';
type OrderStatus = 'processing' | 'delivered' | 'canceled';

interface KeyValuePair {
  [key: string]: any;
}

interface Common {
  id?: number;
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
  wallet: string;
  logo?: string;
  description?: string;
}

interface SaleT extends Common {
  invoiceID: number;
  payAmount?: number;
  saleAmount?: number;
  purchaseAmount?: number;
  status?: string;
  discount?: number;
  vat?: number;
  product: ProductT;
  user: UserT;
  warranty?: WarrantyT;
  method?: PaymentT;

  name?: string;
  address?: string;
  phone?: string;
  email?: string;
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
  supplierId: number;
  supplier: SupplierT;
  productId: number;
  product: ProductT;
  paid_amount: number;
  due_amount: number;
}

interface UserT extends Common {
  name: string;
  email: string;
  phone: string;
  password: string;
  picture: string;
  role: Roles;
  permissions?: any;
  address?: string;
  due?: number;

  refresh_token?: string;
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
