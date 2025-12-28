
import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { 
  Search, Trash2, Plus, Minus, ShoppingCart, 
  RefreshCw, Printer, CreditCard, Banknote, X, CheckCircle 
} from 'lucide-react';
import { formatCurrency } from '../services/mockData';

interface PosSystemProps {
  products: Product[];
}

interface PosItem extends Product {
  quantity: number;
}

const PosSystem: React.FC<PosSystemProps> = ({ products }) => {
  const [cart, setCart] = useState<PosItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [transactionComplete, setTransactionComplete] = useState(false);

  // Derived Categories
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.id.toString().includes(searchTerm);
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // Assuming 15% tax
  const total = subtotal + tax;
  const changeDue = paymentMethod === 'cash' ? Math.max(0, parseFloat(amountReceived || '0') - total) : 0;

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setAmountReceived('');
    setTransactionComplete(false);
    setShowPaymentModal(false);
  };

  const handleProcessPayment = () => {
    setTransactionComplete(true);
    // In a real app, this would save the order to a database
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-2rem)] gap-6 animate-in fade-in duration-500">
      
      {/* Left Side: Product Catalog */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header / Search */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-transparent focus:bg-white dark:focus:bg-gray-800 border focus:border-amber-500 rounded-xl outline-none transition-all dark:text-white"
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col h-full group"
              >
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg mb-3 p-2 flex items-center justify-center overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform" 
                  />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1 flex-1">
                  {product.title}
                </h3>
                <p className="font-bold text-amber-600 dark:text-amber-500">
                  {formatCurrency(product.price)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Cart / Transaction */}
      <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-amber-600" />
            Current Order
          </h2>
          <button 
            onClick={clearCart}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Clear Cart"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center opacity-50">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p>No items added</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl animate-in slide-in-from-right-4">
                <div className="h-12 w-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700 flex-shrink-0">
                  <img src={item.image} className="h-8 w-8 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={() => item.quantity > 1 ? updateQuantity(item.id, -1) : removeFromCart(item.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg text-gray-500"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-medium w-4 text-center dark:text-gray-300">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg text-gray-500"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax (15%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowPaymentModal(true)}
            disabled={cart.length === 0}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Banknote className="h-5 w-5" />
            Pay {formatCurrency(total)}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !transactionComplete && setShowPaymentModal(false)} />
          
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {transactionComplete ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Transaction completed successfully.</p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6 text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-bold dark:text-white">{formatCurrency(total)}</span>
                  </div>
                  {paymentMethod === 'cash' && (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Cash Received</span>
                        <span className="font-bold dark:text-white">{formatCurrency(parseFloat(amountReceived))}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-white font-bold">Change Due</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(changeDue)}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={clearCart} // Reset everything
                    className="flex-1 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-800"
                  >
                    New Order
                  </button>
                  <button className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2">
                    <Printer className="h-5 w-5" /> Print
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Process Payment</h3>
                  <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="text-center mb-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Amount Due</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{formatCurrency(total)}</p>
                  </div>

                  {/* Payment Method Toggle */}
                  <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        paymentMethod === 'cash' 
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Banknote className="h-4 w-4" /> Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        paymentMethod === 'card' 
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" /> Card
                    </button>
                  </div>

                  {/* Cash Input */}
                  {paymentMethod === 'cash' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount Received</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">MAD</span>
                          <input
                            type="number"
                            autoFocus
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            className="w-full pl-14 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-lg font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Change</span>
                        <span className={`text-xl font-bold ${changeDue >= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                          {formatCurrency(changeDue)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleProcessPayment}
                    disabled={paymentMethod === 'cash' && parseFloat(amountReceived || '0') < total}
                    className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98]"
                  >
                    Confirm Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PosSystem;
