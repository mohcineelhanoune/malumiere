
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Category, BannerSlide, ViewState, MenuItem, HomePageConfig, FooterConfig } from '../../types';
import { 
  LayoutDashboard, Package, Tags, Plus, Trash2, Edit2, 
  X, Save, Search, TrendingUp, Users, DollarSign, Image as ImageIcon,
  LogOut, ArrowLeft, Store, Contact, ShoppingBag, MonitorPlay, Menu as MenuIcon,
  Layout, Settings, ChevronDown, ChevronRight, Moon, Sun, Monitor, Layers
} from 'lucide-react';
import { formatCurrency } from '../../services/mockData';
import { useTheme } from '../../contexts/ThemeContext';
import PosSystem from './PosSystem';
import ContactManagement from './ContactManagement';
import OrderManagement from './OrderManagement';
import ProductBuilder from './ProductBuilder';
import CategoryBuilder from './CategoryBuilder';
import BannerBuilder from './BannerBuilder';
import MenuManagement from './MenuManagement';
import PageBuilder from './PageBuilder';
import FooterBuilder from './FooterBuilder';
import { fetchFooterConfig, saveFooterConfig } from '../../services/db';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  banners?: BannerSlide[];
  menuItems?: MenuItem[];
  homeConfig?: HomePageConfig;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onAddCategory: (category: Category) => void;
  onUpdateCategory?: (category: Category) => void;
  onDeleteCategory?: (id: string) => void;
  onAddBanner?: (banner: BannerSlide) => void;
  onUpdateBanner?: (banner: BannerSlide) => void;
  onDeleteBanner?: (id: number) => void;
  onUpdateMenu?: (items: MenuItem[]) => void;
  onDeleteMenuItem?: (id: string) => void;
  onUpdateHomeConfig?: (config: HomePageConfig) => void;
  onNavigate: (view: ViewState) => void;
}

type TabType = 'overview' | 'products' | 'categories' | 'pos' | 'contacts' | 'orders' | 'banners' | 'menu' | 'builder' | 'catBuilder' | 'bannerBuilder' | 'pageBuilder' | 'footerBuilder';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products,
  categories,
  banners = [],
  menuItems = [],
  homeConfig,
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onUpdateMenu,
  onDeleteMenuItem,
  onUpdateHomeConfig,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Sidebar Dropdown State
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    catalogue: true,
    content: false,
    sales: true,
    directory: false
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  useEffect(() => {
    fetchFooterConfig().then(setFooterConfig);
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((acc, curr) => acc + curr.price, 0);
    const catCount = categories.length;
    return { totalProducts, totalValue, categories: catCount };
  }, [products, categories]);

  const handleOpenBuilder = (product?: Product) => {
    if (product) setEditingProduct(product);
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
    if (editingCategory) {
        if (onUpdateCategory) onUpdateCategory(category);
        setEditingCategory(null);
    } else {
        onAddCategory(category);
    }
    setActiveTab('categories');
  };

  const handleEditCategory = (category: Category) => {
      setEditingCategory(category);
      setActiveTab('catBuilder');
  };

  const handleSaveBanner = (banner: BannerSlide) => {
    if (editingBanner) {
        if (onUpdateBanner) onUpdateBanner(banner);
        setEditingBanner(null);
    } else {
        if (onAddBanner) onAddBanner(banner);
    }
    setActiveTab('banners');
  };

  const handleEditBanner = (banner: BannerSlide) => {
      setEditingBanner(banner);
      setActiveTab('bannerBuilder');
  };

  const handleSaveFooter = async (config: FooterConfig) => {
    setFooterConfig(config);
    await saveFooterConfig(config);
  };

  const SidebarItem = ({ id, icon: Icon, label, nested = false }: { id: TabType, icon: any, label: string, nested?: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm font-semibold ${
        activeTab === id 
          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
      } ${nested ? 'ml-3 w-[calc(100%-0.75rem)]' : ''}`}
    >
      <Icon className={`flex-shrink-0 ${nested ? 'h-4 w-4' : 'h-5 w-5'}`} />
      <span>{label}</span>
    </button>
  );

  const SidebarGroup = ({ title, groupKey, children }: { title: string, groupKey: string, children?: React.ReactNode }) => (
    <div className="space-y-1">
      <button 
        onClick={() => toggleGroup(groupKey)}
        className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        {title}
        {openGroups[groupKey] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {openGroups[groupKey] && (
        <div className="flex flex-col gap-1 animate-in slide-in-from-top-2 duration-200">
           {children}
        </div>
      )}
    </div>
  );

  if (activeTab === 'builder') return <ProductBuilder onSave={handleSaveProduct} onCancel={() => { setEditingProduct(null); setActiveTab('products'); }} />;
  if (activeTab === 'catBuilder') return <CategoryBuilder initialData={editingCategory} onSave={handleSaveCategory} onCancel={() => { setEditingCategory(null); setActiveTab('categories'); }} />;
  if (activeTab === 'bannerBuilder') return <BannerBuilder initialData={editingBanner} onSave={handleSaveBanner} onCancel={() => { setEditingBanner(null); setActiveTab('banners'); }} />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans transition-colors duration-300">
      
      {/* Sidebar with dynamic theme colors */}
      <aside className="w-72 bg-white dark:bg-[#0f172a] flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 shadow-xl z-30 transition-colors">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-amber-600 p-2.5 rounded-2xl shadow-xl shadow-amber-600/20">
                <Store className="h-6 w-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none transition-colors">
                    Lumina
                </h1>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest transition-colors">Admin Hub</span>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar pb-8">
          <SidebarItem id="overview" icon={LayoutDashboard} label="Tableau de bord" />
          
          <SidebarGroup title="Gestion Catalogue" groupKey="catalogue">
            <SidebarItem id="products" icon={Package} label="Produits" nested />
            <SidebarItem id="categories" icon={Tags} label="Catégories" nested />
          </SidebarGroup>

          <SidebarGroup title="Ventes & Flux" groupKey="sales">
            <SidebarItem id="orders" icon={ShoppingBag} label="Commandes" nested />
            <SidebarItem id="pos" icon={Monitor} label="Point de Vente (POS)" nested />
          </SidebarGroup>

          <SidebarGroup title="Contenu Web" groupKey="content">
            <SidebarItem id="banners" icon={MonitorPlay} label="Bannières Pub" nested />
            <SidebarItem id="pageBuilder" icon={Layout} label="Page Builder" nested />
            <SidebarItem id="footerBuilder" icon={Settings} label="Pied de page" nested />
            <SidebarItem id="menu" icon={MenuIcon} label="Menus Navigation" nested />
          </SidebarGroup>

          <SidebarGroup title="Répertoire" groupKey="directory">
            <SidebarItem id="contacts" icon={Users} label="Contacts & Clients" nested />
          </SidebarGroup>
        </nav>

        {/* Sidebar Footer with Theme Toggle Button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 transition-colors">
          <div className="flex flex-col gap-2">
            <button 
                onClick={toggleTheme}
                className="group w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-amber-500 transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl group-hover:scale-110 transition-transform">
                        {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-600" />}
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
                    </span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-amber-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`} />
                </div>
            </button>

            <button 
                onClick={() => onNavigate('HOME')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-500 rounded-2xl hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all"
            >
                <ArrowLeft className="h-5 w-5" />
                Quitter l'Admin
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-4 lg:p-10 pb-20">
          
          {/* Header Mobile / Top Bar */}
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <div className="lg:hidden flex items-center gap-3">
                <div className="bg-amber-600 p-2 rounded-xl">
                    <Store className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Admin</h1>
            </div>
            
            <div className="hidden lg:block">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white capitalize flex items-center gap-3 transition-colors">
                    <Layers className="text-amber-600" />
                    {activeTab.replace(/([A-Z])/g, ' $1').trim()}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-sm font-bold text-gray-900 dark:text-white transition-colors">Admin Mohcine</p>
                    <p className="text-[10px] text-amber-600 font-black uppercase tracking-tighter transition-colors">Propriétaire</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold border-2 border-white dark:border-gray-800 shadow-sm transition-colors">
                    M
                </div>
            </div>
          </div>

          {/* Mobile Navigation - Better UI */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-6 mb-6 scrollbar-hide">
             <button onClick={() => setActiveTab('overview')} className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-sm transition-all ${activeTab === 'overview' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400'}`}>Dashboard</button>
             <button onClick={() => setActiveTab('products')} className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-sm transition-all ${activeTab === 'products' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400'}`}>Produits</button>
             <button onClick={() => setActiveTab('orders')} className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-sm transition-all ${activeTab === 'orders' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400'}`}>Commandes</button>
             <button onClick={() => setActiveTab('pos')} className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-sm transition-all ${activeTab === 'pos' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400'}`}>POS</button>
          </div>

          {/* View Components */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'pos' && <PosSystem products={products} />}
            {activeTab === 'contacts' && <ContactManagement />}
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'menu' && <MenuManagement menuItems={menuItems} onUpdate={onUpdateMenu} onDeleteMenuItem={onDeleteMenuItem} />}
            {activeTab === 'pageBuilder' && <PageBuilder config={homeConfig || { sections: [] }} onSave={onUpdateHomeConfig} />}
            {activeTab === 'footerBuilder' && <FooterBuilder config={footerConfig || { blocks: [], bottomText: '' }} onSave={handleSaveFooter} />}

            {activeTab === 'overview' && (
                <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-gray-800 relative overflow-hidden group transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <DollarSign size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl w-fit mb-4">
                                <DollarSign className="h-8 w-8" />
                            </div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Valeur Stock</h3>
                            <p className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{formatCurrency(stats.totalValue)}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-gray-800 relative overflow-hidden group transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Package size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl w-fit mb-4">
                                <Package className="h-8 w-8" />
                            </div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Articles Actifs</h3>
                            <p className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{stats.totalProducts}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-gray-800 relative overflow-hidden group transition-all">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <Tags size={80} />
                        </div>
                        <div className="relative z-10">
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl w-fit mb-4">
                                <Tags className="h-8 w-8" />
                            </div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Catégories</h3>
                            <p className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{stats.categories}</p>
                        </div>
                    </div>
                </div>

                {/* Sales Chart Section */}
                <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-gray-800 transition-all">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider transition-colors">Performance Ventes</h3>
                            <p className="text-sm text-gray-500">Statistiques hebdomadaires du magasin</p>
                        </div>
                        <select className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest px-6 py-3 outline-none text-gray-700 dark:text-gray-300 shadow-sm transition-all">
                            <option>7 Derniers Jours</option>
                            <option>Mois Actuel</option>
                        </select>
                    </div>
                    <div className="h-80 flex items-end justify-between gap-3 sm:gap-6">
                        {[65, 40, 75, 55, 80, 95, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-t-3xl relative group border-x border-t border-transparent hover:border-amber-500/20 transition-all">
                                <div 
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-3xl transition-all duration-1000 group-hover:brightness-110"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] px-3 py-1.5 rounded-xl font-black shadow-2xl z-20 transition-all">
                                        {formatCurrency(h * 150)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] transition-colors">
                        <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                    </div>
                </div>
                </div>
            )}

            {activeTab === 'products' && (
                <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider transition-colors">Catalogue Produits</h2>
                        <p className="text-gray-500 text-sm">Gérez l'inventaire et les prix</p>
                    </div>
                    <button 
                    onClick={() => handleOpenBuilder()}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-amber-600/30 active:scale-95"
                    >
                    <Plus className="h-4 w-4" /> Nouvel Article
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-gray-800 overflow-hidden transition-all">
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100 dark:border-gray-800 transition-colors">
                        <tr>
                            <th className="px-8 py-6">Produit</th>
                            <th className="px-8 py-6">Catégorie</th>
                            <th className="px-8 py-6">Prix Unitaire</th>
                            <th className="px-8 py-6">Stock</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50 transition-colors">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-white border border-gray-100 dark:border-gray-700 p-2 flex-shrink-0 shadow-sm overflow-hidden transition-all group-hover:scale-105">
                                    <img src={product.image} alt="" className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 dark:text-white line-clamp-1 transition-colors">{product.title}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">SKU: #{product.id}</p>
                                </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors">
                                    {product.category}
                                </span>
                            </td>
                            <td className="px-8 py-5 font-black text-gray-900 dark:text-white transition-colors">
                                {formatCurrency(product.price)}
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full transition-all ${product.stock && product.stock > 5 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'}`} />
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">
                                        {product.stock || 10} Unités
                                    </span>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                <button 
                                    onClick={() => handleOpenBuilder(product)}
                                    className="p-3 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/40 rounded-xl transition-all"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={() => {
                                    if (confirm('Supprimer définitivement ce produit ?')) {
                                        onDeleteProduct(product.id);
                                    }
                                    }}
                                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-xl transition-all"
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
                <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider transition-colors">Taxonomie Catalogue</h2>
                        <p className="text-gray-500 text-sm">Organisez vos produits par collections</p>
                    </div>
                    <button 
                    onClick={() => { setEditingCategory(null); setActiveTab('catBuilder'); }}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                    >
                    <Plus className="h-4 w-4" /> Nouvelle Collection
                    </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((cat, idx) => {
                    const prodCount = products.filter(p => p.category === cat.name).length;
                    return (
                        <div key={cat.id || idx} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border border-white dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none flex flex-col items-center text-center group hover:border-amber-500 transition-all relative overflow-hidden transition-all">
                        <div className="h-32 w-32 rounded-[2rem] bg-gray-50 dark:bg-gray-800 p-6 mb-8 shadow-inner overflow-hidden group-hover:scale-110 transition-all duration-500">
                            <img src={cat.image} alt={cat.name} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-all" />
                        </div>
                        <h3 className="font-black text-gray-900 dark:text-white text-2xl mb-1 uppercase tracking-tight transition-colors">{cat.name}</h3>
                        <p className="text-xs font-black text-amber-600 dark:text-amber-500 mb-8 uppercase tracking-[0.2em] transition-colors">{prodCount} Articles</p>
                        
                        <div className="flex gap-3 w-full pt-8 border-t border-gray-100 dark:border-gray-800/50 transition-colors">
                            <button onClick={() => handleEditCategory(cat)} className="flex-1 flex justify-center items-center gap-2 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-amber-600 hover:text-white transition-all shadow-sm">
                                <Edit2 size={14} /> Éditer
                            </button>
                            <button onClick={() => onDeleteCategory && onDeleteCategory(cat.id)} className="flex-1 flex justify-center items-center gap-2 py-3 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                <Trash2 size={14} /> Supprimer
                            </button>
                        </div>
                        </div>
                    );
                    })}
                </div>
                </div>
            )}

            {activeTab === 'banners' && (
                <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider transition-colors">Vizuels Promo</h2>
                        <p className="text-gray-500 text-sm">Gestion des bannières de la page d'accueil</p>
                    </div>
                    <button 
                    onClick={() => { setEditingBanner(null); setActiveTab('bannerBuilder'); }}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                    >
                    <Plus className="h-4 w-4" /> Ajouter Bannière
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {banners.map((banner) => (
                        <div key={banner.id} className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-white dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none flex flex-col md:flex-row gap-10 relative group hover:border-amber-500 transition-all transition-all">
                        <div className="w-full md:w-96 h-56 rounded-3xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800 relative shadow-2xl transition-transform group-hover:scale-[1.02] duration-500 transition-all">
                            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-all" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-4 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/30 transition-all">
                                    Alignement : {banner.align}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight transition-colors">{banner.title || 'Sans Titre'}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 max-w-xl transition-colors">{banner.subtitle || 'Aucun sous-titre descriptif configuré pour cet élément.'}</p>
                            
                            <div className="flex items-center gap-6">
                                <button onClick={() => handleEditBanner(banner)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors">
                                    <Edit2 size={16} /> Modifier Asset
                                </button>
                                <button onClick={() => onDeleteBanner && onDeleteBanner(banner.id)} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors">
                                    <Trash2 size={16} /> Retirer
                                </button>
                            </div>
                        </div>
                        </div>
                    ))}
                    
                    {banners.length === 0 && (
                        <div className="text-center py-24 bg-gray-50/50 dark:bg-gray-900/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800 transition-all">
                            <ImageIcon className="h-20 w-20 text-gray-300 dark:text-gray-700 mx-auto mb-6 opacity-50 transition-all" />
                            <p className="text-gray-500 font-black uppercase tracking-widest text-sm transition-colors">Aucune bannière active</p>
                        </div>
                    )}
                </div>
                </div>
            )}
          </div>
        </div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.1);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
