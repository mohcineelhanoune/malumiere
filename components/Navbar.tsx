import React, { useState } from 'react';
import { ShoppingBag, LogIn, LogOut, Store, Heart, Moon, Sun, Menu, ChevronDown, X, Phone, ShoppingCart, Home, User as UserIcon, Globe, Layout, Grid } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ViewState, MenuItem } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onCategorySelect?: (category: string) => void;
  menuItems?: MenuItem[]; // New Prop
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onCategorySelect, menuItems = [] }) => {
  const { user, logout } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mega Menu Data
  const categories = [
    {
      title: "Electronics",
      items: ["Smart Home", "Headphones", "Cameras", "Speakers"]
    },
    {
      title: "Fashion",
      items: ["Clothing", "Accessories", "Shoes", "Watches"]
    },
    {
      title: "Home & Living",
      items: ["Furniture", "Decor", "Kitchen", "Lighting"]
    },
    {
      title: "Beauty",
      items: ["Skincare", "Makeup", "Fragrance", "Haircare"]
    }
  ];

  const handleCategoryClick = (category: string) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    onNavigate('SHOP');
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  // Helper to resolve icon string to component
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Home': return Home;
      case 'ShoppingCart': return ShoppingCart;
      case 'Phone': return Phone;
      case 'Layout': return Layout;
      case 'Grid': return Grid;
      default: return Menu;
    }
  };

  // Fix NavLink typing to avoid 'key' prop error by using React.FC
  const NavLink: React.FC<{ view: ViewState; label: string; icon?: React.ElementType }> = ({ view, label, icon: Icon }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
        currentView === view
          ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </button>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              <div 
                className="flex items-center cursor-pointer group" 
                onClick={() => onNavigate('HOME')}
              >
                <div className="bg-amber-600 p-2 rounded-lg group-hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400">
                  Lumina
                </span>
              </div>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.sort((a,b) => a.order - b.order).map(item => {
                // If it's a special item (Categories Mega Menu)
                if (item.isSpecial) {
                   return (
                      <div key={item.id} className="group relative px-2">
                        <button 
                          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                          {item.label}
                          <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                        </button>
                        
                        {/* Mega Menu Dropdown */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[800px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto">
                          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 grid grid-cols-4 gap-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-50 to-yellow-500" />
                            {categories.map((category, idx) => (
                              <div key={idx}>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                                  {category.title}
                                </h4>
                                <ul className="space-y-2">
                                  {category.items.map((item) => (
                                    <li key={item}>
                                      <button
                                        onClick={() => handleCategoryClick(category.title === 'Fashion' && item === 'Clothing' ? 'Clothing' : category.title)}
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:translate-x-1 transition-all block text-left w-full"
                                      >
                                        {item}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                            {/* Featured Image in Menu */}
                            <div className="col-span-4 mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-amber-800 dark:text-amber-200">{t('newArrivals')}</h5>
                                <p className="text-sm text-amber-700 dark:text-amber-300">{t('checkCollection')}</p>
                              </div>
                              <button 
                                onClick={() => handleCategoryClick('All')}
                                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-amber-700 transition-colors"
                              >
                                {t('shopNow')}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                   );
                }
                
                // Regular Nav Link
                return (
                   <NavLink key={item.id} view={item.view} label={item.label} icon={getIcon(item.icon)} />
                );
              })}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Language Switcher */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 p-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"
                title="Switch Language"
              >
                <Globe className="h-4 w-4" />
                <span>{language.toUpperCase()}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-all"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {user ? (
                <div className="hidden sm:flex items-center gap-3">
                  <button 
                    onClick={() => onNavigate('DASHBOARD')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                      currentView === 'DASHBOARD'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                      : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {user.name}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('LOGIN')}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => onNavigate('SIGNUP')}
                    className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-full hover:bg-amber-700 shadow-md hover:shadow-lg transition-all"
                  >
                    {t('signup')}
                  </button>
                </div>
              )}

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>

              {/* Wishlist Trigger */}
              <button
                onClick={() => onNavigate('WISHLIST')}
                className={`relative p-2 transition-colors ${
                  currentView === 'WISHLIST' 
                      ? 'text-red-500 bg-red-50 dark:bg-red-900/20 rounded-full' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full'
                }`}
              >
                <Heart className={`h-6 w-6 ${currentView === 'WISHLIST' ? 'fill-current' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full min-w-[1.25rem]">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Trigger */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-full transition-colors"
              >
                <ShoppingBag className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-amber-600 rounded-full min-w-[1.25rem]">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-200 absolute w-full left-0 z-30 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              {menuItems.sort((a,b) => a.order - b.order).map(item => {
                 const IconComp = getIcon(item.icon);
                 
                 // If it's the Categories item, show dropdown logic (simplified for mobile: just list links underneath)
                 if (item.isSpecial) {
                    return (
                        <div key={item.id} className="space-y-2">
                             <div className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-200">
                                <IconComp className="h-5 w-5 text-amber-600 dark:text-amber-500" /> {item.label}
                             </div>
                             <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-800 ml-4 space-y-2">
                                {categories.map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleCategoryClick(cat.title === 'Fashion' ? 'Clothing' : cat.title)}
                                        className="block w-full text-left py-1 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        {cat.title}
                                    </button>
                                ))}
                             </div>
                        </div>
                    );
                 }

                 return (
                    <button 
                        key={item.id}
                        onClick={() => { onNavigate(item.view); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-200"
                    >
                        <IconComp className="h-5 w-5 text-amber-600 dark:text-amber-500" /> {item.label}
                    </button>
                 );
              })}

              {user ? (
                <button
                  onClick={() => { onNavigate('DASHBOARD'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-200"
                >
                  <UserIcon className="h-5 w-5 text-amber-600 dark:text-amber-500" /> {t('myAccount')}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => { onNavigate('LOGIN'); setIsMobileMenuOpen(false); }}
                    className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-200"
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => { onNavigate('SIGNUP'); setIsMobileMenuOpen(false); }}
                    className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium"
                  >
                    {t('signup')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;