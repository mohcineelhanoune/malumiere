
import React, { useState } from 'react';
import { User, Package, MapPin, CreditCard, Search, LogOut, LayoutDashboard, Settings, Truck, ChevronRight, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../services/mockData';
import { ViewState } from '../types';

interface ClientDashboardProps {
  onNavigate: (view: ViewState) => void;
}

// Mock Order Data
const MOCK_ORDERS = [
  {
    id: '#ORD-7829',
    date: 'Oct 24, 2023',
    total: 349.99,
    status: 'Delivered',
    items: 3,
    location: 'Delivered to Front Porch',
    estimatedDelivery: 'Oct 26, 2023'
  },
  {
    id: '#ORD-8821',
    date: 'Nov 02, 2023',
    total: 129.50,
    status: 'Processing',
    items: 1,
    location: 'Fulfillment Center',
    estimatedDelivery: 'Nov 08, 2023'
  },
  {
    id: '#ORD-9002',
    date: 'Nov 15, 2023',
    total: 45.00,
    status: 'Shipped',
    items: 2,
    location: 'Distribution Center, Chicago, IL',
    estimatedDelivery: 'Nov 19, 2023'
  }
];

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'address' | 'track'>('overview');
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState<string | null>(null);

  // Address Form State
  const [address, setAddress] = useState({
    street: '123 Innovation Drive',
    city: 'Tech Valley',
    state: 'CA',
    zip: '94043',
    country: 'United States'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId) return;
    
    // Simulate tracking lookup
    setTrackResult('Searching...');
    setTimeout(() => {
        if (trackId === '#ORD-7829') setTrackResult('Delivered on Oct 26');
        else if (trackId === '#ORD-8821') setTrackResult('Preparing for shipment');
        else if (trackId === '#ORD-9002') setTrackResult('In Transit - Arriving Tomorrow');
        else setTrackResult('Order not found. Please check the ID.');
    }, 1000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
        setIsSaving(false);
        // Toast logic would go here
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h2>
        <button 
          onClick={() => onNavigate('LOGIN')}
          className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
        activeTab === id 
          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 shadow-sm' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-500 text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
            <button
                onClick={() => { logout(); onNavigate('HOME'); }}
                className="text-sm text-red-500 hover:text-red-700 flex items-center justify-center gap-2 mx-auto"
            >
                <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-1">
            <TabButton id="overview" label="Overview" icon={LayoutDashboard} />
            <TabButton id="orders" label="My Orders" icon={Package} />
            <TabButton id="address" label="Address Book" icon={MapPin} />
            <TabButton id="track" label="Track Order" icon={Truck} />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{MOCK_ORDERS.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(524.49)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Default Address</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">Tech Valley, CA</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recent Orders</h3>
                        <button onClick={() => setActiveTab('orders')} className="text-sm text-amber-600 dark:text-amber-500 hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {MOCK_ORDERS.slice(0, 2).map((order) => (
                             <div key={order.id} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                                    <p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}>
                                        {order.status}
                                    </span>
                                    <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
             </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h2>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {MOCK_ORDERS.map((order) => (
                             <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{order.id}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-xl text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                                        <p className="text-sm text-gray-500">{order.items} Items</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                                        <span className="text-gray-500 dark:text-gray-400">Location:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{order.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                                        <span className="text-gray-500 dark:text-gray-400">Est. Delivery:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{order.estimatedDelivery}</span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        View Invoice
                                    </button>
                                    <button 
                                        onClick={() => { setTrackId(order.id); setActiveTab('track'); }}
                                        className="text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Track Order
                                    </button>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
              </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <form onSubmit={handleSaveAddress} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Street Address</label>
                                <input 
                                    type="text" 
                                    value={address.street}
                                    onChange={e => setAddress({...address, street: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">City</label>
                                <input 
                                    type="text" 
                                    value={address.city}
                                    onChange={e => setAddress({...address, city: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State / Province</label>
                                <input 
                                    type="text" 
                                    value={address.state}
                                    onChange={e => setAddress({...address, state: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zip / Postal Code</label>
                                <input 
                                    type="text" 
                                    value={address.zip}
                                    onChange={e => setAddress({...address, zip: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
                                <select 
                                    value={address.country}
                                    onChange={e => setAddress({...address, country: e.target.value})}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                >
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>United Kingdom</option>
                                    <option>Australia</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
              </div>
          )}

          {/* Track Tab */}
          {activeTab === 'track' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Track Your Order</h2>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-500">
                            <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Enter your Order ID</h3>
                        <p className="text-gray-500 dark:text-gray-400">To track your order please enter your Order ID in the box below and press the "Track" button.</p>
                        
                        <form onSubmit={handleTrack} className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Order ID (e.g., #ORD-7829)"
                                value={trackId}
                                onChange={e => setTrackId(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            <button 
                                type="submit"
                                className="bg-gray-900 dark:bg-amber-500 text-white px-6 rounded-xl font-medium hover:opacity-90 transition-opacity"
                            >
                                Track
                            </button>
                        </form>

                        {trackResult && (
                            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 animate-in fade-in zoom-in">
                                <p className="font-bold text-gray-900 dark:text-white mb-1">Status Result</p>
                                <p className="text-amber-600 dark:text-amber-400 font-medium">{trackResult}</p>
                            </div>
                        )}
                    </div>
                </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
