
import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatCurrency } from '../../services/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface CartDrawerProps {
  onCheckoutRequest: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckoutRequest }) => {
  const { 
    isCartOpen, 
    toggleCart, 
    items, 
    removeFromCart, 
    updateQuantity, 
    cartTotal 
  } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out bg-white dark:bg-gray-900 shadow-2xl flex flex-col h-full border-l border-gray-200 dark:border-gray-800">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              {t('shoppingCart')}
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
              onClick={toggleCart}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-full">
                    <ShoppingBag className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                </div>
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{t('emptyCart')}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">{t('emptyCartSub')}</p>
                </div>
                <button 
                    onClick={toggleCart}
                    className="mt-4 text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 hover:underline"
                >
                    {t('startShopping')}
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.id} className="flex py-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                          <h3 className="line-clamp-1 mr-2">{item.title}</h3>
                          <p className="ml-4 whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                            <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-l-lg text-gray-500 dark:text-gray-400"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 font-medium text-gray-900 dark:text-gray-200">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-lg text-gray-500 dark:text-gray-400"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="font-medium text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>{t('remove')}</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                <p>{t('subtotal')}</p>
                <p>{formatCurrency(cartTotal)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 mb-6">
                {t('shippingCalc')}
              </p>
              <button
                onClick={onCheckoutRequest}
                className="flex items-center justify-center rounded-xl border border-transparent bg-amber-600 dark:bg-amber-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-700 dark:hover:bg-amber-600 w-full transition-all active:scale-[0.99]"
              >
                {t('checkout')}
              </button>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  or{' '}
                  <button
                    type="button"
                    className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300"
                    onClick={toggleCart}
                  >
                    {t('continueShopping')}
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
