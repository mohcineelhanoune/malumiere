
import React, { useState } from 'react';
import { ShoppingBag, LogIn, LogOut, Store, Heart, Moon, Sun, Menu, ChevronDown, X, Phone, ShoppingCart, Home, User as UserIcon, Globe, Layout, Grid, ArrowRight, Facebook, Instagram, Mail, Search, Lamp, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ViewState, MenuItem, Category } from '../../types';
import logo from '../../assets/logo.png';
interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onCategorySelect?: (category: string) => void;
  onSearch?: (term: string) => void;
  menuItems?: MenuItem[];
  categories?: Category[];
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onCategorySelect, onSearch, menuItems = [], categories = [] }) => {
  const { user, logout } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
        onSearch(searchValue);
    }
    setIsSearchOpen(false);
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
  const NavLink: React.FC<{ view: ViewState; label: string; isMobile?: boolean }> = ({ view, label, isMobile = false }) => (
    <button
      onClick={() => {
        onNavigate(view);
        setIsMobileMenuOpen(false);
      }}
      className={`${
        isMobile 
        ? 'flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-200'
        : `text-sm font-bold uppercase tracking-wide hover:text-amber-600 dark:hover:text-amber-400 transition-colors ${currentView === view ? 'text-amber-600 dark:text-amber-400' : 'text-gray-800 dark:text-gray-200'}`
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Top Bar - Black Background */}
      <div className="bg-[#1a1a1a] text-white text-[10px] sm:text-xs py-2.5 px-4 hidden md:flex justify-between items-center tracking-widest z-50 relative font-medium">
         <div className="flex items-center gap-6">
            <div className="flex gap-4">
               <a href="#" className="hover:text-amber-500 transition-colors"><Facebook size={14} /></a>
               <a href="#" className="hover:text-amber-500 transition-colors"><Instagram size={14} /></a>
               <a href="#" className="hover:text-amber-500 transition-colors"><Mail size={14} /></a>
            </div>
            <div className="w-px h-3 bg-gray-700"></div>
            <button onClick={toggleLanguage} className="hover:text-amber-500 transition-colors font-bold">{language.toUpperCase()}</button>
            <button onClick={toggleTheme} className="hover:text-amber-500 transition-colors">
               {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
         </div>

         <div className="uppercase font-medium tracking-widest hidden lg:block opacity-90">
            34 RUE BOULMANE ,BOURGOGNE ,CASABLANCA
         </div>

         <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <button 
                onClick={() => onNavigate('ADMIN_DASHBOARD')}
                className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 transition-colors font-black uppercase tracking-widest text-[10px]"
              >
                <Shield size={12} className="fill-current" />
                Tableau de bord Admin
              </button>
            )}
            <a href="#" className="hover:text-amber-500 transition-colors uppercase font-bold">Espace professionnels</a>
         </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            
            {/* LEFT: Menu Items (Desktop) */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-start">
              {menuItems.sort((a,b) => a.order - b.order).map(item => {
                if (item.isSpecial) {
                   return (
                      <div key={item.id} className="group relative">
                        <button 
                          className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        >
                          {item.label}
                          <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                        </button>
                        
                        <div className="absolute top-full left-0 pt-6 w-[1080px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto z-50">
                          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 p-3">
                            <div className="grid grid-cols-7 gap-2">
                              {categories.slice(0, 9).map((cat) => (
                                <button
                                  key={cat.id}
                                  onClick={() => handleCategoryClick(cat.name)}
                                  className="text-center group/item flow-root items-center gap-1"
                                >
                                  <div className="h-100 w-100 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <center><img src={cat.image} alt={cat.name} className="h-full w-full object-cover m-auto" /></center>
                                  </div>
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors">
                                    {cat.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                   );
                }
                return <NavLink key={item.id} view={item.view} label={item.label} />;
              })}
            </div>

            {/* MOBILE: Menu Trigger */}
            <div className="lg:hidden flex-1 flex justify-start">
                <button 
                  className="p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* CENTER: Logo */}
            <div className="flex-shrink-0 flex justify-center lg:flex-1">
                <div className="flex flex-col items-center cursor-pointer group" onClick={() => onNavigate('HOME')}>
                  <img src={logo} alt="Logo" className="h-20 w-auto" />
                </div>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
                {/* Search Interaction */}
                <div className="relative">
                    {isSearchOpen ? (
                        <form 
                            onSubmit={handleSearchSubmit} 
                            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white dark:bg-gray-800 rounded-full border-2 border-amber-500 shadow-xl z-50 w-64 md:w-80 px-4 py-2 transition-all duration-300 animate-in slide-in-from-right-10 fade-in"
                        >
                            <input 
                                type="text" 
                                autoFocus
                                className="bg-transparent border-none outline-none w-full text-sm ml-1 text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder={t('search') + "..."}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onBlur={() => {
                                    setTimeout(() => {
                                        if(!searchValue) setIsSearchOpen(false);
                                    }, 200);
                                }}
                            />
                            <button type="submit" className="p-1 text-amber-600 hover:text-amber-700"><Search size={18}/></button>
                            <button type="button" onClick={() => setIsSearchOpen(false)} className="p-1 text-gray-400 hover:text-gray-600"><X size={18}/></button>
                        </form>
                    ) : (
                        <button 
                            className="hidden sm:block text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-1"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Admin Quick Switch (Tablet/Desktop) */}
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => onNavigate('ADMIN_DASHBOARD')}
                    className="hidden sm:flex items-center justify-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all border border-amber-100 dark:border-amber-900/30"
                    title="Console Administration"
                  >
                    <Shield className="h-5 w-5" />
                  </button>
                )}
                
                <button 
                  onClick={() => user ? onNavigate('DASHBOARD') : onNavigate('LOGIN')} 
                  className="text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-1"
                >
                   <UserIcon className="h-5 w-5" />
                </button>

                <button 
                  onClick={toggleCart} 
                  className="relative text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 p-1"
                >
                   <ShoppingCart className="h-5 w-5" />
                   {itemCount > 0 && (
                     <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
                       {itemCount}
                     </span>
                   )}
                   <span className="text-sm font-bold hidden sm:block">{itemCount}</span>
                </button>

                <button 
                  onClick={() => onNavigate('CONTACT')}
                  className="hidden sm:block text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-1"
                >
                  <Phone className="h-5 w-5" />
                </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-200 absolute w-full left-0 z-30 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-6">
                 <input 
                    type="text" 
                    className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder={t('search') + "..."}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                 />
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </form>

              {menuItems.sort((a,b) => a.order - b.order).map(item => (
                 <NavLink key={item.id} view={item.view} label={item.label} isMobile={true} />
              ))}

              {/* Admin Access Mobile */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => { onNavigate('ADMIN_DASHBOARD'); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 font-bold text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30"
                >
                  <Shield className="h-5 w-5" /> Console Administration
                </button>
              )}

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4 space-y-3">
                 <button onClick={toggleLanguage} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-200">
                    <Globe className="h-5 w-5 text-amber-600" /> Language: {language.toUpperCase()}
                 </button>
                 <button onClick={toggleTheme} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-gray-700 dark:text-gray-200">
                    {theme === 'light' ? <Moon className="h-5 w-5 text-amber-600" /> : <Sun className="h-5 w-5 text-amber-600" />} Theme: {theme === 'light' ? 'Dark' : 'Light'}
                 </button>
              </div>

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
