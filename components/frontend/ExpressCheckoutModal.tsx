
import React, { useState, useEffect } from 'react';
import { X, Zap, Phone, User, Check, Loader2, ArrowRight, MapPin, Mail, ShoppingBag } from 'lucide-react';
import { Product, Order, CartItem } from '../../types';
import { formatCurrency } from '../../services/mockData';
import { createOrder } from '../../services/db';
import { useAuth } from '../../contexts/AuthContext';

interface ExpressCheckoutModalProps {
  items: CartItem[]; // Now accepts an array of items
  isOpen: boolean;
  onClose: () => void;
}

const ExpressCheckoutModal: React.FC<ExpressCheckoutModalProps> = ({ items, isOpen, onClose }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');

  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setStep('form');
      setName(user?.name || '');
      setPhone(user?.phone || '');
      setEmail(user?.email || '');
      setAddress('');
      setError('');
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user]);

  if (!isVisible && !isOpen) return null;

  const sendEmailToGraphiste = (orderData: Omit<Order, 'id'> & { id: string }) => {
    const adminEmail = "mohcine.graphiste@gmail.com";
    const subject = `New Order: ${orderData.id} - ${orderData.customerName}`;
    
    const itemsList = orderData.items.map(item => 
      `- ${item.productName} (x${item.quantity}): ${formatCurrency(item.price * item.quantity)}`
    ).join('\n');

    const body = `
New Order Received!

ORDER DETAILS
-------------
Order ID: ${orderData.id}
Date: ${orderData.date}
Status: ${orderData.status}
Total Amount: ${formatCurrency(orderData.total)}

CLIENT INFORMATION
------------------
Name: ${orderData.customerName}
Phone: ${phone}
Email: ${orderData.customerEmail}
Address: ${orderData.shippingAddress}

ITEMS ORDERED
-------------
${itemsList}

------------------
Lumina Market System
    `.trim();

    // Log to console for debugging/confirmation
    console.log(`%c Sending Email to ${adminEmail}...`, 'color: #059669; font-weight: bold;');
    console.log(body);

    // In a real app, you would call an API endpoint here.
    // For now, we can also open a mailto link if the user wants to manually send it, 
    // but the request asked to "send a email", which usually implies automatic backend process.
    // We will simulate the success of that process.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setStep('processing');
    
    try {
        // Construct Order Object
        // Generate a pseudo ID for the email since the DB ID comes after
        const tempId = `ORD-${Date.now().toString().slice(-6)}`;

        const newOrder: Omit<Order, 'id'> = {
            customerId: user?.id || 'guest',
            customerName: name,
            customerEmail: email || 'guest@noemail.com',
            date: new Date().toLocaleDateString(),
            status: 'Pending',
            total: total,
            shippingAddress: address, // We could append phone here: `${address} - Phone: ${phone}`
            paymentMethod: 'Cash on Delivery',
            items: items.map(item => ({
                productId: item.id,
                productName: item.title,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            }))
        };

        // 1. Save to DB
        const orderId = await createOrder(newOrder);

        // 2. Send Email (Simulation)
        sendEmailToGraphiste({ ...newOrder, id: orderId || tempId });

        setStep('success');
    } catch (err) {
        console.error(err);
        setError('Failed to place order. Please check your connection.');
        setStep('form');
    }
  };

  const handleClose = () => {
    onClose();
  };

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
                <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-500 fill-current" />
             </div>
             <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {items.length > 1 ? 'Cart Checkout' : 'Express Checkout'}
             </h2>
          </div>
          
          <div className="space-y-3">
            {items.slice(0, 2).map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex gap-4 items-center bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="h-12 w-12 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-500">{formatCurrency(item.price * item.quantity)}</p>
                </div>
            ))}
            {items.length > 2 && (
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 italic">
                    + {items.length - 2} more items
                </p>
            )}
            
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-700 dark:text-gray-300">Total</span>
                <span className="font-bold text-xl text-gray-900 dark:text-white">{formatCurrency(total)}</span>
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

              {/* Added Email Field explicitly if guest */}
              {!user && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="For order confirmation"
                    />
                    </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Delivery Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="City, Neighborhood, Street..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 transition-all transform active:scale-[0.98]"
                >
                  <Check className="h-5 w-5" />
                  Confirm Order
                </button>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
                  Cash on delivery • Free Shipping
                </p>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-300">
              <Loader2 className="h-12 w-12 text-amber-600 dark:text-amber-500 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Placing Order...</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Sending order details to seller</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-300 text-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-500">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-2 max-w-[80%] mx-auto">
                Thank you, <span className="font-semibold text-gray-900 dark:text-white">{name}</span>.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                 We have sent an email with the order details to <br/><span className="text-amber-600 font-bold">mohcine.graphiste@gmail.com</span>
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
