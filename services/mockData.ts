
import { Product, Category, MenuItem } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    price: 249.99,
    originalPrice: 299.99,
    description: "Immerse yourself in high-fidelity audio with our premium noise-canceling headphones. Features 30-hour battery life and plush ear cushions.",
    category: "Electronics",
    image: "https://picsum.photos/400/400?random=1",
    rating: { rate: 4.8, count: 120 }
  },
  {
    id: 2,
    title: "Ergonomic Office Chair",
    price: 199.50,
    description: "Work in comfort with this fully adjustable ergonomic chair. Breathable mesh back and lumbar support included.",
    category: "Home & Living",
    image: "https://picsum.photos/400/400?random=2",
    rating: { rate: 4.5, count: 85 }
  },
  {
    id: 3,
    title: "Analog Classic Watch",
    price: 129.00,
    originalPrice: 159.00,
    description: "A timeless piece for the modern professional. Genuine leather strap and water-resistant casing.",
    category: "Accessories",
    image: "https://picsum.photos/400/400?random=3",
    rating: { rate: 4.2, count: 45 }
  },
  {
    id: 4,
    title: "Smart Home Hub",
    price: 89.99,
    description: "Control your entire home with voice commands. Compatible with all major smart devices.",
    category: "Electronics",
    image: "https://picsum.photos/400/400?random=4",
    rating: { rate: 4.6, count: 210 }
  },
  {
    id: 5,
    title: "Organic Cotton T-Shirt",
    price: 29.95,
    description: "Sustainably sourced, soft, and durable. The perfect essential tee for any wardrobe.",
    category: "Fashion",
    image: "https://picsum.photos/400/400?random=5",
    rating: { rate: 4.3, count: 300 }
  },
  {
    id: 6,
    title: "Minimalist Backpack",
    price: 65.00,
    originalPrice: 85.00,
    description: "Water-resistant canvas with a dedicated laptop compartment. Ideal for commuting or travel.",
    category: "Accessories",
    image: "https://picsum.photos/400/400?random=6",
    rating: { rate: 4.7, count: 150 }
  },
  {
    id: 7,
    title: "Ceramic Coffee Set",
    price: 45.00,
    description: "Handcrafted ceramic mugs and pot. Microwave and dishwasher safe.",
    category: "Home & Living",
    image: "https://picsum.photos/400/400?random=7",
    rating: { rate: 4.9, count: 60 }
  },
  {
    id: 8,
    title: "Mechanical Keyboard",
    price: 110.00,
    originalPrice: 140.00,
    description: "Tactile switches for the ultimate typing experience. RGB backlighting with customizable modes.",
    category: "Electronics",
    image: "https://picsum.photos/400/400?random=8",
    rating: { rate: 4.8, count: 95 }
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Electronics', image: 'https://picsum.photos/400/400?random=101', description: 'Gadgets and devices' },
  { id: 'cat_2', name: 'Fashion', image: 'https://picsum.photos/400/400?random=102', description: 'Clothing and apparel' },
  { id: 'cat_3', name: 'Home & Living', image: 'https://picsum.photos/400/400?random=103', description: 'Furniture and decor' },
  { id: 'cat_4', name: 'Beauty', image: 'https://picsum.photos/400/400?random=104', description: 'Skincare and makeup' },
  { id: 'cat_5', name: 'Accessories', image: 'https://picsum.photos/400/400?random=106', description: 'Watches, bags, and jewelry' }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: 'nav_home', label: 'Home', view: 'HOME', icon: 'Home', order: 0 },
  { id: 'nav_cats', label: 'Categories', view: 'SHOP', icon: 'Grid', order: 1, isSpecial: true },
  { id: 'nav_shop', label: 'Shop', view: 'SHOP', icon: 'ShoppingCart', order: 2 },
  { id: 'nav_contact', label: 'Contact', view: 'CONTACT', icon: 'Phone', order: 3 },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(amount);
};
