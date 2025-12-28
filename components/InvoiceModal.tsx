
import React, { useEffect, useState } from 'react';
import { X, Printer, Download, Store } from 'lucide-react';
import { Order } from '../types';
import { formatCurrency } from '../services/mockData';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 print:p-0">
      {/* Backdrop - Hidden when printing */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity print:hidden ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-2xl transform transition-all duration-300 print:shadow-none print:w-full print:max-w-none print:h-auto print:rounded-none print:dark:bg-white print:dark:text-black ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Actions Header - Hidden when printing */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 print:hidden">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Invoice Details</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 md:p-12 bg-white dark:bg-gray-900 print:bg-white print:text-black" id="invoice-content">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 text-amber-600 mb-4">
                <Store className="h-8 w-8" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white print:text-black">Lumina</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">
                <p>123 Innovation Drive</p>
                <p>Tech Valley, CA 94043</p>
                <p>support@luminamarket.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-bold text-gray-200 dark:text-gray-800 print:text-gray-200 uppercase tracking-widest mb-2">Invoice</h1>
              <p className="font-bold text-gray-900 dark:text-white print:text-black text-lg">{order.id}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">Date: {order.date}</p>
              <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200 print:bg-transparent print:text-black print:border-black' : 
                'bg-amber-100 text-amber-700 border-amber-200 print:bg-transparent print:text-black print:border-black'
              }`}>
                {order.status}
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-12 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Bill To</h3>
              <p className="font-bold text-gray-900 dark:text-white print:text-black">{order.customerName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">{order.customerEmail}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">{order.shippingAddress}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Payment Info</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">Method: <span className="font-medium text-gray-900 dark:text-white print:text-black">{order.paymentMethod}</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">Currency: MAD</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-12">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 print:border-gray-300">
                <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Item Description</th>
                <th className="text-center py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Qty</th>
                <th className="text-right py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Price</th>
                <th className="text-right py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 print:divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 text-sm font-medium text-gray-900 dark:text-white print:text-black">
                    {item.productName}
                  </td>
                  <td className="py-4 text-center text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-right text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-4 text-right text-sm font-bold text-gray-900 dark:text-white print:text-black">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.total * 0.85)}</span> {/* Estimating subtotal assuming included tax */}
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 print:text-gray-600">
                <span>Tax (15%)</span>
                <span>{formatCurrency(order.total * 0.15)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white print:text-black border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 print:border-gray-200 text-center text-xs text-gray-400 dark:text-gray-500 print:text-gray-500">
            <p>Thank you for your business.</p>
            <p className="mt-1">For questions regarding this invoice, please contact support@luminamarket.com</p>
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible; }
          #invoice-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            margin: 0; 
            padding: 40px !important;
            background: white !important;
            color: black !important;
          }
          .dark #invoice-content {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceModal;
