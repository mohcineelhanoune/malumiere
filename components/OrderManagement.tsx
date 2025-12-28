
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Eye, MoreHorizontal, CheckCircle, 
  Clock, Truck, XCircle, FileText, ArrowUpDown 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../services/mockData';
import InvoiceModal from './InvoiceModal';

// Enhanced Mock Data for Orders
const MOCK_ORDERS: Order[] = [
  {
    id: '#ORD-7829',
    customerId: 'C-101',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    date: 'Oct 24, 2023',
    status: 'Delivered',
    total: 349.99,
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Maple St, Tech Valley, CA 94043',
    items: [
      { productId: 1, productName: 'Premium Wireless Headphones', quantity: 1, price: 249.99 },
      { productId: 4, productName: 'Smart Home Hub', quantity: 1, price: 89.99 }
    ]
  },
  {
    id: '#ORD-8821',
    customerId: 'C-102',
    customerName: 'Bob Smith',
    customerEmail: 'bob.smith@gmail.com',
    date: 'Nov 02, 2023',
    status: 'Processing',
    total: 129.50,
    paymentMethod: 'PayPal',
    shippingAddress: '789 Oak Ln, Suburbia, NY 10001',
    items: [
      { productId: 3, productName: 'Analog Classic Watch', quantity: 1, price: 129.50 }
    ]
  },
  {
    id: '#ORD-9002',
    customerId: 'C-103',
    customerName: 'Sarah Connor',
    customerEmail: 'sarah@skynet.net',
    date: 'Nov 15, 2023',
    status: 'Shipped',
    total: 45.00,
    paymentMethod: 'Credit Card',
    shippingAddress: '333 Future Blvd, Los Angeles, CA 90001',
    items: [
      { productId: 7, productName: 'Ceramic Coffee Set', quantity: 1, price: 45.00 }
    ]
  },
  {
    id: '#ORD-9150',
    customerId: 'C-104',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    date: 'Nov 18, 2023',
    status: 'Pending',
    total: 1200.00,
    paymentMethod: 'Cash on Delivery',
    shippingAddress: '555 Unknown Rd, Nowhere, TX 75001',
    items: [
      { productId: 2, productName: 'Ergonomic Office Chair', quantity: 2, price: 199.50 },
      { productId: 8, productName: 'Mechanical Keyboard', quantity: 2, price: 110.00 }
    ]
  },
  {
    id: '#ORD-9201',
    customerId: 'C-105',
    customerName: 'Emily Blunt',
    customerEmail: 'emily@hollywood.com',
    date: 'Nov 20, 2023',
    status: 'Cancelled',
    total: 89.99,
    paymentMethod: 'Credit Card',
    shippingAddress: '101 Studio Ln, Hollywood, CA 90210',
    items: [
        { productId: 4, productName: 'Smart Home Hub', quantity: 1, price: 89.99 }
    ]
  }
];

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
    setIsInvoiceOpen(true);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Shipped': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Processing': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
        case 'Delivered': return <CheckCircle className="h-4 w-4" />;
        case 'Shipped': return <Truck className="h-4 w-4" />;
        case 'Processing': return <Clock className="h-4 w-4" />;
        case 'Pending': return <Clock className="h-4 w-4" />;
        case 'Cancelled': return <XCircle className="h-4 w-4" />;
        default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">View and manage customer orders and invoices</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 flex">
                {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status as any)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                            statusFilter === status 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
            <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredOrders.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        No orders found.
                    </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{order.customerName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative group">
                             <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                className="appearance-none bg-gray-100 dark:bg-gray-700 border-none text-xs font-medium py-1.5 pl-3 pr-8 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-300"
                             >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                             </select>
                             <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                        </div>
                        
                        <button 
                          onClick={() => handleViewInvoice(order)}
                          className="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal 
        order={selectedOrder}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};

export default OrderManagement;
