
export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  emailVerified?: boolean;
  role?: 'admin' | 'customer';
}

export interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice?: number; // Optional original price for sales
  description: string;
  category: string;
  image: string;
  images?: string[]; // New: Gallery support
  rating: {
    rate: number;
    count: number;
  };
  ft_url?: string; // Fiche Technique URL
  fi_url?: string; // Fiche Instruction URL
  stock?: number; // Stock Quantity
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  image: string;
  description?: string;
  productCount?: number;
}

export interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link?: string;
  align: 'left' | 'center' | 'right';
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: 'Client' | 'Supplier';
  company?: string;
  ice?: string; // ICE field for Moroccan enterprises
  address: string;
  status: 'Active' | 'Inactive';
}

export interface MenuItem {
  id: string;
  label: string;
  view: ViewState;
  icon: string; // Icon name key
  order: number;
  isSpecial?: boolean; // For complex items like Categories
}

export interface HomeSection {
  id: string;
  type: 'hero' | 'promo' | 'parallax' | 'categories' | 'contact_strip';
  label: string;
  visible: boolean;
  order: number;
  settings?: {
    image?: string;
    title?: string;
    subtitle?: string;
    cta?: string;
    maxItems?: number;
  };
}

export interface HomePageConfig {
  sections: HomeSection[];
}

export interface FooterBlock {
  id: string;
  type: 'text' | 'links' | 'newsletter' | 'social' | 'html' | 'image';
  title?: string;
  content?: string;
  settings?: {
    align?: 'left' | 'center' | 'right';
    width?: string; // e.g., "col-span-1"
    links?: { label: string; url: string }[];
    imageUrl?: string;
    bgColor?: string;
    textColor?: string;
  };
}

export interface FooterConfig {
  blocks: FooterBlock[];
  bottomText: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type ViewState = 'HOME' | 'SHOP' | 'CONTACT' | 'LOGIN' | 'SIGNUP' | 'WISHLIST' | 'PRODUCT_DETAILS' | 'DASHBOARD' | 'ADMIN_DASHBOARD' | 'SHIPPING' | 'FAQ';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}
