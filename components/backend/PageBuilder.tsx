
import React, { useState, useEffect } from 'react';
import { HomeSection, HomePageConfig } from '../../types';
import { 
  ArrowUp, ArrowDown, Eye, EyeOff, Save, 
  Settings, Layout, Image as ImageIcon, 
  Type, Check, Loader2, Sparkles, X, Plus, Trash2, Edit3
} from 'lucide-react';

interface PageBuilderProps {
  config: HomePageConfig;
  onSave: (config: HomePageConfig) => void;
}

const SECTION_TYPES: { type: HomeSection['type']; label: string; description: string }[] = [
  { type: 'hero', label: 'Hero Slider', description: 'Main banner carousel with call to actions.' },
  { type: 'promo', label: 'Flash Deals', description: 'Horizontal list of products on sale.' },
  { type: 'parallax', label: 'Parallax Banner', description: 'Full-width image with scrolling depth effect.' },
  { type: 'categories', label: 'Category Grid', description: 'Showcases products grouped by category.' },
  { type: 'contact_strip', label: 'Contact Strip', description: 'Footer info bar with store contact details.' },
];

const DEFAULT_SECTIONS: HomeSection[] = [
  { id: 'hero-1', type: 'hero', label: 'Hero Banner Slider', visible: true, order: 0 },
  { id: 'promo-1', type: 'promo', label: 'Flash Deals / Promo', visible: true, order: 1 },
  { id: 'parallax-1', type: 'parallax', label: 'Parallax Mid-Banner', visible: true, order: 2, settings: { 
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
      title: "Premium Quality, Unmatched Style",
      subtitle: "Experience the difference with our handpicked selection of premium goods designed for the modern lifestyle.",
      cta: "Explore Collection"
  }},
  { id: 'categories-1', type: 'categories', label: 'Category Showcases', visible: true, order: 3 },
  { id: 'contact-1', type: 'contact_strip', label: 'Footer Info Strip', visible: true, order: 4 }
];

const PageBuilder: React.FC<PageBuilderProps> = ({ config, onSave }) => {
  const [sections, setSections] = useState<HomeSection[]>(config?.sections || DEFAULT_SECTIONS);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Sync with prop if it changes
  useEffect(() => {
    if (config?.sections && config.sections.length > 0) {
      setSections(config.sections);
    }
  }, [config]);

  const handleToggleVisibility = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    
    // Update order property
    const reordered = newSections.map((s, idx) => ({ ...s, order: idx }));
    setSections(reordered);
  };

  const handleUpdateSettings = (id: string, newSettings: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, settings: { ...s.settings, ...newSettings } } : s));
  };

  const handleUpdateLabel = (id: string, newLabel: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, label: newLabel } : s));
  };

  const handleAddSection = (type: HomeSection['type'], label: string) => {
    const newId = `${type}-${Date.now()}`;
    const newSection: HomeSection = {
      id: newId,
      type,
      label: label,
      visible: true,
      order: sections.length,
      settings: type === 'parallax' ? {
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        title: "New Section Title",
        subtitle: "Add your subtitle here",
        cta: "Shop Now"
      } : undefined
    };
    setSections([...sections, newSection]);
    setShowAddMenu(false);
    setEditingSectionId(newId);
  };

  const handleDeleteSection = (id: string) => {
    if (confirm('Are you sure you want to remove this section from the homepage?')) {
      setSections(prev => prev.filter(s => s.id !== id).map((s, idx) => ({ ...s, order: idx })));
      if (editingSectionId === id) setEditingSectionId(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ sections });
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layout className="h-6 w-6 text-amber-600" />
            Home Page Builder
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Configure the layout, visibility, and content of your landing page sections.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Publish Changes
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
           Page Structure
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {sections.length === 0 && (
            <div className="p-12 text-center text-gray-400 italic">
               No sections added. Click "Add Section" to start building your page.
            </div>
          )}
          {sections.sort((a,b) => a.order - b.order).map((section, index) => (
            <div key={section.id} className="p-4 flex flex-col gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition-colors">
              <div className="flex items-center gap-4">
                {/* Drag Controls */}
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-900 disabled:opacity-20"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-900 disabled:opacity-20"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>

                {/* Section Title & Icon */}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${section.visible ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                   {section.type === 'hero' && <ImageIcon className="h-6 w-6" />}
                   {section.type === 'promo' && <Sparkles className="h-6 w-6" />}
                   {section.type === 'parallax' && <Layout className="h-6 w-6" />}
                   {section.type === 'categories' && <Type className="h-6 w-6" />}
                   {section.type === 'contact_strip' && <X className="h-6 w-6 rotate-45" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-bold truncate ${section.visible ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {section.label}
                    </h3>
                    {!section.visible && <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">Hidden</span>}
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-tighter opacity-70">{section.type}</p>
                </div>

                {/* Visibility & Settings Toggle */}
                <div className="flex items-center gap-1 sm:gap-2">
                   <button 
                     onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
                     className={`p-2 rounded-lg transition-colors ${editingSectionId === section.id ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                     title="Edit Content & Settings"
                   >
                     <Settings className="h-5 w-5" />
                   </button>
                   <button 
                     onClick={() => handleToggleVisibility(section.id)}
                     className={`p-2 rounded-lg transition-colors ${section.visible ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                     title={section.visible ? "Hide Section" : "Show Section"}
                   >
                     {section.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                   </button>
                   <button 
                     onClick={() => handleDeleteSection(section.id)}
                     className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                     title="Delete Section"
                   >
                     <Trash2 className="h-5 w-5" />
                   </button>
                </div>
              </div>

              {/* Comprehensive Editing Panel */}
              {editingSectionId === section.id && (
                <div className="ml-12 sm:ml-16 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-300">
                  <div className="space-y-6">
                    {/* Metadata Edit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                            <Edit3 className="h-4 w-4 text-amber-600" /> Admin Label (Internal Use)
                        </label>
                        <input 
                            type="text" 
                            value={section.label}
                            onChange={e => handleUpdateLabel(section.id, e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm dark:text-white"
                        />
                    </div>

                    {/* Component Specific Settings */}
                    {section.settings && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" /> Image URL
                                </label>
                                <input 
                                    type="text" 
                                    value={section.settings.image || ''}
                                    onChange={e => handleUpdateSettings(section.id, { image: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                                    <Type className="h-4 w-4" /> Main Heading
                                </label>
                                <input 
                                    type="text" 
                                    value={section.settings.title || ''}
                                    onChange={e => handleUpdateSettings(section.id, { title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm dark:text-white"
                                />
                            </div>
                            </div>
                            <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subtitle / Description</label>
                                <textarea 
                                    rows={3}
                                    value={section.settings.subtitle || ''}
                                    onChange={e => handleUpdateSettings(section.id, { subtitle: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-none dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Button Text</label>
                                <input 
                                    type="text" 
                                    value={section.settings.cta || ''}
                                    onChange={e => handleUpdateSettings(section.id, { cta: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none text-sm dark:text-white"
                                />
                            </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={() => setEditingSectionId(null)}
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-sm"
                        >
                            <Check className="h-4 w-4" /> Apply Local Changes
                        </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Section Button */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/30 flex justify-center border-t border-gray-100 dark:border-gray-700">
           <div className="relative">
              <button 
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-500 dark:hover:border-amber-500 text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-500 px-8 py-3 rounded-2xl font-bold transition-all group"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                Add New Section
              </button>

              {showAddMenu && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                   <div className="p-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Select Section Type</span>
                   </div>
                   <div className="space-y-1">
                      {SECTION_TYPES.map((type) => (
                        <button
                          key={type.type}
                          onClick={() => handleAddSection(type.type, type.label)}
                          className="w-full text-left p-3 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 group transition-colors"
                        >
                           <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-amber-600 transition-colors">{type.label}</h4>
                           <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{type.description}</p>
                        </button>
                      ))}
                   </div>
                   <button 
                    onClick={() => setShowAddMenu(false)}
                    className="w-full mt-2 p-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-center"
                   >
                     Cancel
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-4 rounded-xl flex gap-3">
         <Sparkles className="h-5 w-5 text-amber-600 flex-shrink-0" />
         <p className="text-sm text-amber-800 dark:text-amber-200">
           <strong>Pro Tip:</strong> You can add multiple instances of the same section type. For example, add two Parallax Banners with different images to create a rich narrative layout.
         </p>
      </div>
    </div>
  );
};

export default PageBuilder;
