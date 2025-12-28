
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { PRODUCTS as MOCK_PRODUCTS, INITIAL_CATEGORIES as MOCK_CATEGORIES, INITIAL_MENU_ITEMS } from './services/mockData';
import { 
  fetchProductsFromDB, addProductToDB, updateProductInDB, deleteProductFromDB,
  fetchCategoriesFromDB, addCategoryToDB, updateCategoryInDB, deleteCategoryFromDB,
  fetchBannersFromDB, addBannerToDB, updateBannerInDB, deleteBannerFromDB,
  fetchMenuItemsFromDB, upsertMenuItemToDB, deleteMenuItemFromDB,
  fetchHomeConfig, saveHomeConfig, fetchFooterConfig, saveFooterConfig
} from './services/db';
import { ViewState, Product, Category, BannerSlide, MenuItem, CartItem, HomePageConfig, HomeSection, FooterConfig } from './types';
import { useAuth } from './contexts/AuthContext';
import { ArrowLeftRight, X, Shield, Loader2, Lock } from 'lucide-react';

// Components organized by folder
import Navbar from './components/frontend/Navbar';
import CartDrawer from './components/frontend/CartDrawer';
import WishlistView from './components/frontend/WishlistView';
import ProductDetails from './components/frontend/ProductDetails';
import BannerSlider from './components/frontend/BannerSlider';
import PromotionalSection from './components/frontend/PromotionalSection';
import FloatingNotification from './components/frontend/FloatingNotification';
import ComparisonModal from './components/frontend/ComparisonModal';
import CategoryShowcase from './components/frontend/CategoryShowcase';
import CategoryGrid from './components/frontend/CategoryGrid';
import ContactView from './components/frontend/ContactView';
import ClientDashboard from './components/frontend/ClientDashboard';
import ShippingReturns from './components/frontend/ShippingReturns';
import FAQ from './components/frontend/FAQ';
import ShopView from './components/frontend/ShopView'; 
import ParallaxBanner from './components/frontend/ParallaxBanner'; 
import ExpressCheckoutModal from './components/frontend/ExpressCheckoutModal';
import DynamicFooter from './components/frontend/DynamicFooter';

import AdminDashboard from './components/backend/AdminDashboard';
import AuthForm from './components/common/AuthForms';

const INITIAL_SLIDES: BannerSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    title: "New Season Arrivals",
    subtitle: "Discover the latest fashion trends designed to elevate your style.",
    cta: "Shop Collection",
    align: "left"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    title: "Premium Audio Gear",
    subtitle: "Immerse yourself in crystal clear sound with our latest headphones.",
    cta: "Explore Audio",
    align: "right"
  }
];

const DEFAULT_HOME_CONFIG: HomePageConfig = {
    sections: [
        { id: 'hero', type: 'hero', label: 'Hero Banner Slider', visible: true, order: 0 },
        { id: 'promo', type: 'promo', label: 'Flash Deals / Promo', visible: true, order: 1 },
        { id: 'parallax', type: 'parallax', label: 'Parallax Mid-Banner', visible: true, order: 2, settings: { 
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
            title: "Premium Quality, Unmatched Style",
            subtitle: "Experience the difference with our handpicked selection of premium goods designed for the modern lifestyle.",
            cta: "Explore Collection"
        }},
        { id: 'categories', type: 'categories', label: 'Category Showcases', visible: true, order: 3 },
        { id: 'contact_strip', type: 'contact_strip', label: 'Footer Info Strip', visible: true, order: 4 }
    ]
};

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
    blocks: [
        { id: 'f-1', type: 'text', title: 'Ma Lumière', content: 'Le Design Pour Tous. We bring high-end design within reach of everyone, curated for quality and elegance.', settings: { width: 'col-span-1' } },
        { id: 'f-2', type: 'links', title: 'Shop', settings: { width: 'col-span-1', links: [{label: 'New Arrivals', url: '#'}, {label: 'Best Sellers', url: '#'}, {label: 'Flash Deals', url: '#'}] } },
        { id: 'f-3', type: 'links', title: 'Support', settings: { width: 'col-span-1', links: [{label: 'Contact Us', url: '#'}, {label: 'Shipping', url: '#'}, {label: 'FAQ', url: '#'}] } },
        { id: 'f-4', type: 'newsletter', title: 'Newsletter', content: 'Subscribe to get special offers and once-in-a-lifetime deals.', settings: { width: 'col-span-1' } }
    ],
    bottomText: '© 2024 Ma Lumière - All Rights Reserved.'
};

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const { user } = useAuth();
  const { t } = useLanguage();
  const { items: cartItems } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomePageConfig>(DEFAULT_HOME_CONFIG);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
        const [fetchedProducts, fetchedCategories, fetchedBanners, fetchedMenu, fetchedHome, fetchedFooter] = await Promise.all([
            fetchProductsFromDB(),
            fetchCategoriesFromDB(),
            fetchBannersFromDB(),
            fetchMenuItemsFromDB(),
            fetchHomeConfig(),
            fetchFooterConfig()
        ]);

        if (fetchedProducts.length === 0) {
            setProducts(MOCK_PRODUCTS);
            MOCK_PRODUCTS.forEach(p => addProductToDB(p));
        } else {
            setProducts(fetchedProducts);
        }

        if (fetchedCategories.length === 0) {
             setCategories(MOCK_CATEGORIES);
             MOCK_CATEGORIES.forEach(c => addCategoryToDB(c));
        } else {
             setCategories(fetchedCategories);
        }

        if (fetchedBanners.length === 0) {
             setSlides(INITIAL_SLIDES);
             INITIAL_SLIDES.forEach(b => addBannerToDB(b));
        } else {
             setSlides(fetchedBanners);
        }

        if (fetchedMenu.length === 0) {
             setMenuItems(INITIAL_MENU_ITEMS);
             INITIAL_MENU_ITEMS.forEach(m => upsertMenuItemToDB(m));
        } else {
             setMenuItems(fetchedMenu);
        }

        if (fetchedHome) {
            setHomeConfig(fetchedHome);
        } else {
            setHomeConfig(DEFAULT_HOME_CONFIG);
            saveHomeConfig(DEFAULT_HOME_CONFIG);
        }

        if (fetchedFooter) {
            setFooterConfig(fetchedFooter);
        } else {
            setFooterConfig(DEFAULT_FOOTER_CONFIG);
            saveFooterConfig(DEFAULT_FOOTER_CONFIG);
        }

    } catch (error) {
        console.error("Error initializing data:", error);
        setProducts(MOCK_PRODUCTS);
        setCategories(MOCK_CATEGORIES);
        setSlides(INITIAL_SLIDES);
        setMenuItems(INITIAL_MENU_ITEMS);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setSelectedCategory('All'); 
    setLoading(true); 
    setCurrentView('SHOP');
    window.scrollTo(0, 0);
    setLoading(false);
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
        const { id, ...productPayload } = newProduct;
        await addProductToDB(productPayload);
        await loadData();
    } catch (error) {
        console.error("Failed to add product", error);
        alert("Erreur lors de l'ajout du produit.");
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
        await updateProductInDB(updatedProduct);
        await loadData();
    } catch (error) {
        console.error("Failed to update product", error);
        alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
        await deleteProductFromDB(id);
        setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
        console.error("Failed to delete product", error);
    }
  };

  const handleAddCategory = async (newCategory: Category) => {
    try {
        const { id, ...payload } = newCategory;
        await addCategoryToDB(payload);
        await loadData();
    } catch (error) {
        console.error("Failed to add category", error);
        alert("Erreur lors de l'ajout de la catégorie.");
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
        await updateCategoryInDB(updatedCategory);
        await loadData();
    } catch (error) {
        console.error("Failed to update category", error);
        alert("Erreur lors de la mise à jour de la catégorie.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
        await deleteCategoryFromDB(id);
        await loadData();
    } catch (error) {
        console.error("Failed to delete category", error);
        alert("Erreur lors de la suppression de la catégorie.");
    }
  };

  const handleAddBanner = async (newBanner: BannerSlide) => {
    const { id, ...payload } = newBanner;
    await addBannerToDB(payload);
    await loadData();
  };

  const handleUpdateBanner = async (updatedBanner: BannerSlide) => {
    await updateBannerInDB(updatedBanner);
    await loadData();
  };

  const handleDeleteBanner = async (id: number) => {
    await deleteBannerFromDB(id);
    await loadData();
  };

  const handleUpdateMenu = async (items: MenuItem[]) => {
    setMenuItems(items);
    for (const item of items) {
        await upsertMenuItemToDB(item);
    }
    const menu = await fetchMenuItemsFromDB();
    setMenuItems(menu);
  };

  const handleDeleteMenuItem = async (id: string) => {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      await deleteMenuItemFromDB(id);
  };

  const handleUpdateHomeConfig = async (config: HomePageConfig) => {
      setHomeConfig(config);
      await saveHomeConfig(config);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        result = result.filter(p => p.title.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower));
    }

    if (selectedCategory === 'On Sale') {
        result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
    } else if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy, searchTerm]);

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setCheckoutItems(cartItems);
      setIsCheckoutOpen(true);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('PRODUCT_DETAILS');
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: number) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };
  
  const isCompared = (productId: number) => compareList.some(p => p.id === productId);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('SHOP');
  };

  const renderView = () => {
    if (loading && products.length === 0 && currentView === 'HOME') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-amber-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading store data...</p>
            </div>
        );
    }

    switch (currentView) {
      case 'LOGIN':
        return (
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <AuthForm 
              type="LOGIN" 
              onSuccess={(email) => {
                  if (email?.toLowerCase() === 'contact@mr-graphiste.ma') {
                      setCurrentView('ADMIN_DASHBOARD');
                  } else {
                      setCurrentView('HOME');
                  }
              }} 
              onSwitchMode={setCurrentView} 
            />
          </div>
        );
      case 'SIGNUP':
        return (
          <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            <AuthForm 
              type="SIGNUP" 
              onSuccess={() => setCurrentView('HOME')} 
              onSwitchMode={setCurrentView} 
            />
          </div>
        );
      case 'WISHLIST':
        return (
          <WishlistView 
            onNavigateHome={() => setCurrentView('SHOP')}
            onProductClick={handleProductClick}
          />
        );
      case 'CONTACT':
        return <ContactView />;
      case 'DASHBOARD':
        return <ClientDashboard onNavigate={setCurrentView} />;
      case 'SHIPPING':
        return <ShippingReturns />;
      case 'FAQ':
        return <FAQ />;
      case 'ADMIN_DASHBOARD':
        if (!user || user.role !== 'admin') {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-300">
                    <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full mb-4 text-red-600 dark:text-red-500">
                        <Lock className="h-12 w-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                        You do not have permission to access the Admin Console. Please log in with an administrator account.
                    </p>
                    <button 
                        onClick={() => setCurrentView('LOGIN')}
                        className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-700 transition-colors"
                    >
                        Log In as Admin
                    </button>
                </div>
            );
        }
        return (
          <AdminDashboard 
            products={products}
            categories={categories}
            banners={slides}
            menuItems={menuItems}
            homeConfig={homeConfig}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddBanner={handleAddBanner}
            onUpdateBanner={handleUpdateBanner}
            onDeleteBanner={handleDeleteBanner}
            onUpdateMenu={handleUpdateMenu}
            onDeleteMenuItem={handleDeleteMenuItem}
            onUpdateHomeConfig={handleUpdateHomeConfig}
            onNavigate={setCurrentView}
          />
        );
      case 'PRODUCT_DETAILS':
        return selectedProduct ? (
          <ProductDetails 
            product={selectedProduct} 
            relatedProducts={products}
            onBack={() => setCurrentView('SHOP')}
            onProductClick={handleProductClick}
            isCompared={compareList.some(p => p.id === selectedProduct.id)}
            onToggleCompare={toggleCompare}
          />
        ) : (
          <div className="p-8 text-center">Product not found</div>
        );
      case 'SHOP':
        return (
          <ShopView 
            products={filteredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            loadingMore={false}
            hasMore={false}
            onSelectCategory={setSelectedCategory}
            onSortChange={setSortBy}
            onProductClick={handleProductClick}
            isCompared={isCompared}
            onToggleCompare={toggleCompare}
            onLoadMore={() => {}}
          />
        );
      case 'HOME':
      default:
        return (
          <div className="w-full flex flex-col animate-in fade-in duration-500">
            {homeConfig.sections.filter(s => s.visible).sort((a,b) => a.order - b.order).map(section => {
                switch(section.type) {
                    case 'hero':
                        return <BannerSlider key={section.id} slides={slides} />;
                    case 'promo':
                        return (
                            <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                                <PromotionalSection 
                                    products={products} 
                                    onProductClick={handleProductClick}
                                    onViewAll={() => {
                                        setSelectedCategory('On Sale');
                                        setCurrentView('SHOP');
                                        window.scrollTo(0, 0);
                                    }}
                                />
                            </div>
                        );
                    case 'category_grid':
                        return (
                            <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                                <CategoryGrid 
                                    categories={categories}
                                    selectedIds={section.settings?.categoryIds}
                                    onCategoryClick={handleCategorySelect}
                                />
                            </div>
                        );
                    case 'parallax':
                        return (
                            <ParallaxBanner 
                                key={section.id}
                                image={section.settings?.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"}
                                title={section.settings?.title || "Premium Quality, Unmatched Style"}
                                subtitle={section.settings?.subtitle || "Experience the difference with our handpicked selection of premium goods designed for the modern lifestyle."}
                                cta={section.settings?.cta || "Explore Collection"}
                                onCtaClick={() => setCurrentView('SHOP')}
                            />
                        );
                    case 'categories':
                        return (
                            <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                                {categories.slice(0, 4).map((category) => {
                                    const hasProducts = products.some(p => p.category === category.name);
                                    if (!hasProducts) return null;
                                    return (
                                        <CategoryShowcase 
                                            key={category.id}
                                            title={category.name}
                                            subtitle={`Explore our collection of ${category.name}`}
                                            category={category.name}
                                            products={products}
                                            onProductClick={handleProductClick}
                                            isCompared={isCompared}
                                            onToggleCompare={toggleCompare}
                                        />
                                    );
                                })}
                            </div>
                        );
                    case 'contact_strip':
                        return (
                            <div key={section.id} className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 py-16 w-full transition-colors duration-300">
                                <div className="max-w-7xl mx-auto px-4 text-center">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Ma lumière : 34 rue Boulmane , Bourgogne Casablanca</h3>
                                    <p className="text-lg md:text-xl text-amber-600 dark:text-amber-500 font-bold">Tel : 0663195596 - Whatsap : 0700141404</p>
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
            <FloatingNotification 
                products={products} 
                onProductClick={handleProductClick} 
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-300">
      {currentView !== 'ADMIN_DASHBOARD' && (
        <Navbar 
          currentView={currentView} 
          onNavigate={setCurrentView}
          onCategorySelect={handleCategorySelect}
          onSearch={handleSearch}
          menuItems={menuItems}
          categories={categories}
        />
      )}
      <main className="flex-grow">
        {renderView()}
      </main>
      
      <ExpressCheckoutModal 
        items={checkoutItems}
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />

      {compareList.length > 0 && currentView !== 'ADMIN_DASHBOARD' && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-2xl p-2 pl-6 flex items-center gap-4 border border-gray-700 dark:border-gray-200">
            <span className="font-medium text-sm whitespace-nowrap">
              {compareList.length} Selected
            </span>
            <div className="flex -space-x-2">
              {compareList.map(p => (
                <div key={p.id} className="w-8 h-8 rounded-full border-2 border-gray-900 dark:border-white overflow-hidden bg-white">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pl-2">
              <button onClick={() => setCompareList([])} className="p-2 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-900">
                <X className="h-4 w-4" />
              </button>
              <button onClick={() => setIsCompareModalOpen(true)} className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-50 dark:hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-900/20">
                <ArrowLeftRight className="h-4 w-4" /> Compare
              </button>
            </div>
          </div>
        </div>
      )}
      {currentView !== 'ADMIN_DASHBOARD' && <CartDrawer onCheckoutRequest={handleCheckout} />}
      <ComparisonModal products={compareList} isOpen={isCompareModalOpen} onClose={() => setIsCompareModalOpen(false)} onRemove={removeFromCompare} />
      
      {currentView !== 'ADMIN_DASHBOARD' && (
          <DynamicFooter config={footerConfig} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <WishlistProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
