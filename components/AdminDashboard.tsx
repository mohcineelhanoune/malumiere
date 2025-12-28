
import React, { useState, useMemo } from 'react';
import { Product, Category, BannerSlide, ViewState, MenuItem } from '../types';
import {
  LayoutDashboard, Package, Tags, Plus, Trash2, Edit2,
  X, Save, Search, TrendingUp, Users, DollarSign, Image as ImageIcon,
  LogOut, ArrowLeft, Store, Contact, ShoppingBag, MonitorPlay, Menu as MenuIcon,
  Download, Upload
} from 'lucide-react';
import { formatCurrency } from '../services/mockData';
import PosSystem from './PosSystem';
import ContactManagement from './ContactManagement';
import OrderManagement from './OrderManagement';
import ProductBuilder from './ProductBuilder';
import CategoryBuilder from './CategoryBuilder';
import BannerBuilder from './BannerBuilder';
import MenuManagement from './MenuManagement';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  banners?: BannerSlide[];
  menuItems?: MenuItem[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onAddCategory: (category: Category) => void;
  onAddBanner?: (banner: BannerSlide) => void;
  onDeleteBanner?: (id: number) => void;
  onUpdateMenu?: (items: MenuItem[]) => void;
  onNavigate: (view: ViewState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  banners = [],
  menuItems = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onAddBanner,
  onDeleteBanner,
  onUpdateMenu,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'pos' | 'contacts' | 'orders' | 'banners' | 'menu' | 'builder' | 'catBuilder' | 'bannerBuilder'>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Calculate Stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((acc, curr) => acc + curr.price, 0);
    const catCount = categories.length;
    const lowStock = products.filter(p => Math.random() > 0.8).length; // Simulated
    return { totalProducts, totalValue, categories: catCount, lowStock };
  }, [products, categories]);

  const handleOpenBuilder = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
    }
    setActiveTab('builder');
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      onUpdateProduct({ ...product, id: editingProduct.id });
      setEditingProduct(null);
    } else {
      onAddProduct(product);
    }
    setActiveTab('products');
  };

  const handleSaveCategory = (category: Category) => {
    onAddCategory(category);
    setActiveTab('categories');
  };

  const handleSaveBanner = (banner: BannerSlide) => {
    if (onAddBanner) onAddBanner(banner);
    setActiveTab('banners');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'products_export.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    if (!files || files.length === 0) return;

    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = e => {
      try {
        const importedProducts = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedProducts)) {
          importedProducts.forEach(product => {
            // Ensure ID is not duplicated or let the system handle it
            // For simplicity, we just pass it to onAddProduct
            onAddProduct(product);
          });
          alert(`${importedProducts.length} products imported successfully!`);
        } else {
          alert('Invalid file format. Please upload a JSON array of products.');
        }
      } catch (err) {
        alert('Error parsing JSON file. Please ensure it is a valid JSON.');
      }
    };
    // Reset input
    event.target.value = '';
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === id
          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  // If in builder mode, show full screen builder
  if (activeTab === 'builder') {
    return (
      <ProductBuilder
        onSave={handleSaveProduct}
        onCancel={() => {
          setEditingProduct(null);
          setActiveTab('products');
        }}
      />
    );
  }

  // If in category builder mode
  if (activeTab === 'catBuilder') {
    return (
      <CategoryBuilder
        onSave={handleSaveCategory}
        onCancel={() => setActiveTab('categories')}
      />
    );
  }

  // If in banner builder mode
  if (activeTab === 'bannerBuilder') {
    return (
      <BannerBuilder
        onSave={handleSaveBanner}
        onCancel={() => setActiveTab('banners')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex font-sans">

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
            Lumina Admin
          </h1>
          <p className="text-gray-500 text-xs mt-1">Management Console</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem id="orders" icon={ShoppingBag} label="Orders" />
          <SidebarItem id="products" icon={Package} label="Products" />
          <SidebarItem id="categories" icon={Tags} label="Categories" />
          <SidebarItem id="banners" icon={MonitorPlay} label="Banners" />
          <SidebarItem id="menu" icon={MenuIcon} label="Menus" />
          <SidebarItem id="contacts" icon={Users} label="Contacts" />
          <SidebarItem id="pos" icon={Store} label="Point of Sale" />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => onNavigate('HOME')}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors w-full"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Shop
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">

          {/* Header Mobile */}
          <div className="lg:hidden mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <button onClick={() => onNavigate('HOME')} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Nav Tabs */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'overview' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-800'}`}>Overview</button>
            <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'orders' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-800'}`}>Orders</button>
            <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'products' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-800'}`}>Products</button>
            <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'menu' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-800'}`}>Menus</button>
            <button onClick={() => setActiveTab('pos')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'pos' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-800'}`}>POS</button>
          </div>

          {/* Tab Views */}
          {activeTab === 'pos' && <PosSystem products={products} />}
          {activeTab === 'contacts' && <ContactManagement />}
          {activeTab === 'orders' && <OrderManagement />}

          {activeTab === 'menu' && (
            <MenuManagement
              menuItems={menuItems}
              onUpdate={(items) => onUpdateMenu && onUpdateMenu(items)}
            />
          )}

          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Inventory Value</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                      <Package className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Products</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                      <Tags className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Categories</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.categories}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-600 rounded-xl">
                      <Users className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+4%</span>
                  </div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Customers</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1,248</p>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white">Sales Statistics</h3>
                  <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm px-3 py-1">
                    <option>Last 7 Days</option>
                    <option>Last Month</option>
                  </select>
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[65, 40, 75, 55, 80, 95, 70].map((h, i) => (
                    <div key={i} className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-lg relative group">
                      <div
                        className="absolute bottom-0 w-full bg-amber-500 rounded-t-lg transition-all duration-500 group-hover:bg-amber-400"
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-400">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 dark:border-gray-700"
                    title="Export Products to JSON"
                  >
                    <Download className="h-5 w-5" /> Export
                  </button>
                  <label className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer" title="Import Products from JSON">
                    <Upload className="h-5 w-5" /> Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => handleOpenBuilder()}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="h-5 w-5" /> Add Product
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
                      <tr>
                        <th className="px-6 py-4 font-medium">Product</th>
                        <th className="px-6 py-4 font-medium">Category</th>
                        <th className="px-6 py-4 font-medium">Price</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 dark:border-gray-700 p-1 flex-shrink-0">
                                <img src={product.image} alt="" className="h-full w-full object-contain" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{product.title}</p>
                                <p className="text-xs text-gray-500">ID: #{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit triggers builder if we want, or just simple edit modal. For now just standard edit placeholder */}
                              <button
                                className="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this product?')) {
                                    onDeleteProduct(product.id);
                                  }
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
                <button
                  onClick={() => setActiveTab('catBuilder')}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-5 w-5" /> Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, idx) => {
                  const prodCount = products.filter(p => p.category === cat.name).length;
                  return (
                    <div key={cat.id || idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 group hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                      <div className="h-20 w-20 rounded-xl bg-gray-100 dark:bg-gray-900 p-2 flex-shrink-0">
                        <img src={cat.image} alt={cat.name} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{cat.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{prodCount} Products</p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-all">
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Homepage Banners</h2>
                <button
                  onClick={() => setActiveTab('bannerBuilder')}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus className="h-5 w-5" /> Add Banner
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {banners.map((banner) => (
                  <div key={banner.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6 relative group">
                    <button
                      onClick={() => onDeleteBanner && onDeleteBanner(banner.id)}
                      className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="w-full md:w-64 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-900 relative">
                      <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                          {banner.align} aligned
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{banner.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{banner.subtitle}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                          CTA: {banner.cta}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {banners.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No banners created yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
