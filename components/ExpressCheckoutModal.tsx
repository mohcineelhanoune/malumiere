
import React, { useState, useEffect } from 'react';
import { X, Zap, Phone, User, Check, Loader2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../services/mockData';

interface ExpressCheckoutModalProps {
  product: Product;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}

const ExpressCheckoutModal: React.FC<ExpressCheckoutModalProps> = ({ product, quantity, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setStep('form');
      setName('');
      setPhone('');
      setError('');
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setStep('processing');
    
    // Simulate API call
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const handleClose = () => {
    if (step === 'success') {
      // Maybe trigger a global refresh or redirect logic here
    }
    onClose();
  };

  const totalPrice = product.price * quantity;

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Product Summary */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <Zap className="h-5 w-5 text-amber-600 dark:text-amber-500 fill-current" />
             </div>
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">Express Checkout</h2>
          </div>
          
          <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="h-16 w-16 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
               <img src={product.image} alt={product.title} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Qty: {quantity}</p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-500 mt-1">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-900/50">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="Enter your name"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 transition-all transform active:scale-[0.98]"
                >
                  <Zap className="h-5 w-5 fill-current" />
                  Complete Order
                </button>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Secure 256-bit encrypted checkout
                </p>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
              <Loader2 className="h-12 w-12 text-amber-600 dark:text-amber-500 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing Order...</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Please wait a moment</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-300 text-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-500">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-[80%]">
                Thank you, <span className="font-semibold text-gray-900 dark:text-white">{name}</span>. We've received your order and will contact you at {phone} shortly.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpressCheckoutModal;
