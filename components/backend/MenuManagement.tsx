
import React, { useState } from 'react';
import { MenuItem, ViewState } from '../../types';
import { 
  Home, ShoppingCart, Phone, Grid, Menu, Trash2, 
  ArrowUp, ArrowDown, Plus, Save, Edit2, Layout
} from 'lucide-react';

interface MenuManagementProps {
  menuItems: MenuItem[];
  onUpdate: (items: MenuItem[]) => void;
  onDeleteMenuItem?: (id: string) => void; // New prop for deletion
}

const MenuManagement: React.FC<MenuManagementProps> = ({ menuItems, onUpdate, onDeleteMenuItem }) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    label: '',
    view: 'HOME',
    icon: 'Home',
  });

  const iconOptions = [
    { value: 'Home', label: 'Home', icon: Home },
    { value: 'ShoppingCart', label: 'Shop', icon: ShoppingCart },
    { value: 'Phone', label: 'Contact', icon: Phone },
    { value: 'Grid', label: 'Categories', icon: Grid },
    { value: 'Layout', label: 'Dashboard', icon: Layout },
    { value: 'Menu', label: 'Generic', icon: Menu },
  ];

  const viewOptions: { value: ViewState; label: string }[] = [
    { value: 'HOME', label: 'Home Page' },
    { value: 'SHOP', label: 'Shop / All Products' },
    { value: 'CONTACT', label: 'Contact Page' },
    { value: 'DASHBOARD', label: 'Client Dashboard' },
  ];

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      if (onDeleteMenuItem) {
          onDeleteMenuItem(id); // Call parent handler which calls DB
      } else {
          // Fallback if prop not provided
          const updated = menuItems.filter(item => item.id !== id);
          onUpdate(updated);
      }
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...menuItems];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    
    // Update order property
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx }));
    onUpdate(reordered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = menuItems.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } as MenuItem : item
      );
      onUpdate(updated);
      setEditingItem(null);
    } else {
      const newItem: MenuItem = {
        id: `menu_${Date.now()}`,
        label: formData.label || 'New Item',
        view: formData.view || 'HOME',
        icon: formData.icon || 'Menu',
        order: menuItems.length,
        isSpecial: formData.isSpecial || false,
      };
      onUpdate([...menuItems, newItem]);
    }
    
    setFormData({ label: '', view: 'HOME', icon: 'Home' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h2>
        <p className="text-gray-500 dark:text-gray-400">Configure the main navigation links for the website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Menu List */}
        <div className="lg:col-span-2">
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 font-medium text-gray-500 dark:text-gray-400 text-sm">
                 Current Menu Structure
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                 {menuItems.sort((a,b) => a.order - b.order).map((item, index) => {
                    // Find icon component for preview
                    const IconComp = iconOptions.find(opt => opt.value === item.icon)?.icon || Menu;
                    
                    return (
                       <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <div className="flex flex-col gap-1">
                             <button 
                                onClick={() => handleMove(index, 'up')}
                                disabled={index === 0}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30"
                             >
                                <ArrowUp className="h-4 w-4" />
                             </button>
                             <button 
                                onClick={() => handleMove(index, 'down')}
                                disabled={index === menuItems.length - 1}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-900 disabled:opacity-30"
                             >
                                <ArrowDown className="h-4 w-4" />
                             </button>
                          </div>
                          
                          <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-500">
                             <IconComp className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1">
                             <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 dark:text-white">{item.label}</h3>
                                {item.isSpecial && (
                                   <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                      Special Feature
                                   </span>
                                )}
                             </div>
                             <p className="text-xs text-gray-500">Links to: {item.view}</p>
                          </div>

                          <div className="flex gap-2">
                             <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                             >
                                <Edit2 className="h-4 w-4" />
                             </button>
                             {!item.isSpecial && (
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                             )}
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Right: Add/Edit Form */}
        <div>
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                 {editingItem ? 'Edit Menu Item' : 'Add New Item'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                    <input 
                       type="text" 
                       required
                       value={formData.label}
                       onChange={e => setFormData({...formData, label: e.target.value})}
                       className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                       placeholder="e.g. About Us"
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Page</label>
                    <select 
                       value={formData.view}
                       onChange={e => setFormData({...formData, view: e.target.value as ViewState})}
                       className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                       {viewOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                       ))}
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                    <div className="grid grid-cols-4 gap-2">
                       {iconOptions.map((opt) => (
                          <button
                             key={opt.value}
                             type="button"
                             onClick={() => setFormData({...formData, icon: opt.value})}
                             className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                formData.icon === opt.value 
                                   ? 'bg-amber-50 border-amber-500 text-amber-600 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-500' 
                                   : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                             }`}
                          >
                             <opt.icon className="h-5 w-5 mb-1" />
                             <span className="text-[10px]">{opt.label}</span>
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="flex gap-3 pt-4">
                    {editingItem && (
                       <button
                          type="button"
                          onClick={() => {
                             setEditingItem(null);
                             setFormData({ label: '', view: 'HOME', icon: 'Home' });
                          }}
                          className="flex-1 py-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                       >
                          Cancel
                       </button>
                    )}
                    <button
                       type="submit"
                       className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
                    >
                       {editingItem ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                       {editingItem ? 'Save Changes' : 'Add Item'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
