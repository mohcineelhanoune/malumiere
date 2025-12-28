
import React, { useState, useEffect } from 'react';
import { FooterConfig, FooterBlock } from '../../types';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Save, 
  Type, Link as LinkIcon, Share2, Mail, Code, Image as ImageIcon,
  Check, X, Settings, Loader2
} from 'lucide-react';

interface FooterBuilderProps {
  config: FooterConfig;
  onSave: (config: FooterConfig) => void;
}

const BLOCK_TYPES = [
  { type: 'text', label: 'Text/About', icon: Type, description: 'Basic text block for brand bio or info.' },
  { type: 'links', label: 'Navigation Links', icon: LinkIcon, description: 'A column of clickable navigation links.' },
  { type: 'newsletter', label: 'Newsletter', icon: Mail, description: 'Email subscription form block.' },
  { type: 'social', label: 'Social Links', icon: Share2, description: 'Icons for social media profiles.' },
  { type: 'image', label: 'Logo/Image', icon: ImageIcon, description: 'Display a logo or promotional image.' },
  { type: 'html', label: 'Custom HTML', icon: Code, description: 'Embed custom HTML or scripts.' }
];

const FooterBuilder: React.FC<FooterBuilderProps> = ({ config, onSave }) => {
  const [blocks, setBlocks] = useState<FooterBlock[]>(config?.blocks || []);
  const [bottomText, setBottomText] = useState(config?.bottomText || '© 2024 Ma Lumière. All rights reserved.');
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    if (config) {
      setBlocks(config.blocks || []);
      setBottomText(config.bottomText || '');
    }
  }, [config]);

  const handleAddBlock = (type: any) => {
    const newBlock: FooterBlock = {
      id: `block-${Date.now()}`,
      type: type.type,
      title: type.label,
      content: type.type === 'text' ? 'Add your text here...' : '',
      settings: {
        align: 'left',
        width: 'col-span-1',
        links: type.type === 'links' ? [{ label: 'Home', url: '/' }] : []
      }
    };
    setBlocks([...blocks, newBlock]);
    setShowAddMenu(false);
    setEditingBlockId(newBlock.id);
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (editingBlockId === id) setEditingBlockId(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < blocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    setBlocks(newBlocks);
  };

  const updateBlock = (id: string, updates: Partial<FooterBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ blocks, bottomText });
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-amber-600" />
            Footer Builder
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Construct your website footer using modular content blocks.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Update Footer
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
           Footer Structure (Grid View)
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[300px] bg-gray-50/50 dark:bg-gray-950/20">
          {blocks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center text-gray-400 italic py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
               <Plus className="h-10 w-10 mb-2 opacity-20" />
               No blocks added yet.
            </div>
          )}
          
          {blocks.map((block, index) => (
            <div 
              key={block.id} 
              className={`relative group bg-white dark:bg-gray-900 rounded-xl border-2 transition-all p-5 shadow-sm ${editingBlockId === block.id ? 'border-amber-500 ring-4 ring-amber-500/10' : 'border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-900'}`}
            >
              {/* Block Toolbar */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => handleMove(index, 'up')} className="p-1 hover:text-amber-600"><ArrowUp size={14}/></button>
                <button onClick={() => handleMove(index, 'down')} className="p-1 hover:text-amber-600"><ArrowDown size={14}/></button>
                <div className="w-px h-3 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <button onClick={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)} className="p-1 hover:text-blue-600"><Settings size={14}/></button>
                <button onClick={() => handleRemoveBlock(block.id)} className="p-1 hover:text-red-600"><Trash2 size={14}/></button>
              </div>

              {/* Block Content Preview */}
              <div className="space-y-2 pointer-events-none select-none">
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-amber-600 mb-2">
                    {BLOCK_TYPES.find(t => t.type === block.type)?.icon && React.createElement(BLOCK_TYPES.find(t => t.type === block.type)!.icon, { size: 12 })}
                    {block.type}
                 </div>
                 <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">{block.title || 'Untitled Block'}</h4>
                 <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{block.content || 'No content provided'}</p>
              </div>
            </div>
          ))}

          {/* Add Block Button within grid */}
          <button 
            onClick={() => setShowAddMenu(true)}
            className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all group"
          >
             <Plus className="h-6 w-6 mb-2 group-hover:scale-110 transition-transform" />
             <span className="text-xs font-bold uppercase">Add Block</span>
          </button>
        </div>
      </div>

      {/* Editing Sidebar/Panel (Conditional) */}
      {editingBlockId && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-amber-500/30 p-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <Settings className="text-amber-600" />
               Edit Block: {blocks.find(b => b.id === editingBlockId)?.title}
            </h3>
            <button onClick={() => setEditingBlockId(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Block Title</label>
                   <input 
                      type="text" 
                      value={blocks.find(b => b.id === editingBlockId)?.title || ''}
                      onChange={e => updateBlock(editingBlockId, { title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm dark:text-white focus:ring-2 focus:ring-amber-500"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Content / Description</label>
                   <textarea 
                      rows={4}
                      value={blocks.find(b => b.id === editingBlockId)?.content || ''}
                      onChange={e => updateBlock(editingBlockId, { content: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm dark:text-white focus:ring-2 focus:ring-amber-500 resize-none"
                   />
                </div>
             </div>
             
             <div className="space-y-4">
                {/* Type Specific Fields */}
                {blocks.find(b => b.id === editingBlockId)?.type === 'links' && (
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Navigation Links</label>
                      <div className="space-y-2">
                        {blocks.find(b => b.id === editingBlockId)?.settings?.links?.map((link, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                               placeholder="Label"
                               value={link.label}
                               onChange={(e) => {
                                  const newLinks = [...(blocks.find(b => b.id === editingBlockId)?.settings?.links || [])];
                                  newLinks[idx].label = e.target.value;
                                  updateBlock(editingBlockId, { settings: { ...blocks.find(b => b.id === editingBlockId)!.settings, links: newLinks } });
                               }}
                               className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs dark:text-white"
                            />
                            <input 
                               placeholder="URL"
                               value={link.url}
                               onChange={(e) => {
                                  const newLinks = [...(blocks.find(b => b.id === editingBlockId)?.settings?.links || [])];
                                  newLinks[idx].url = e.target.value;
                                  updateBlock(editingBlockId, { settings: { ...blocks.find(b => b.id === editingBlockId)!.settings, links: newLinks } });
                               }}
                               className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs dark:text-white"
                            />
                            <button 
                               onClick={() => {
                                  const newLinks = (blocks.find(b => b.id === editingBlockId)?.settings?.links || []).filter((_, i) => i !== idx);
                                  updateBlock(editingBlockId, { settings: { ...blocks.find(b => b.id === editingBlockId)!.settings, links: newLinks } });
                               }}
                               className="text-red-500 p-1 hover:bg-red-50 rounded"
                            >
                               <Trash2 size={14}/>
                            </button>
                          </div>
                        ))}
                        <button 
                           onClick={() => {
                              const newLinks = [...(blocks.find(b => b.id === editingBlockId)?.settings?.links || []), { label: 'New Link', url: '#' }];
                              updateBlock(editingBlockId, { settings: { ...blocks.find(b => b.id === editingBlockId)!.settings, links: newLinks } });
                           }}
                           className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                        >
                           <Plus size={12}/> Add Link
                        </button>
                      </div>
                   </div>
                )}

                {blocks.find(b => b.id === editingBlockId)?.type === 'image' && (
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
                      <input 
                         type="text" 
                         value={blocks.find(b => b.id === editingBlockId)?.settings?.imageUrl || ''}
                         onChange={e => updateBlock(editingBlockId, { settings: { ...blocks.find(b => b.id === editingBlockId)!.settings, imageUrl: e.target.value } })}
                         placeholder="https://..."
                         className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm dark:text-white"
                      />
                   </div>
                )}

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Text Alignment</label>
                   <div className="flex gap-2">
                      {['left', 'center', 'right'].map(align => (
                         <button 
                           key={align}
                           onClick={() => updateBlock(editingBlockId, { settings: { ...blocks.find(b => b.id === editingBlockId)!.settings, align: align as any } })}
                           className={`px-4 py-1.5 rounded-lg border text-xs font-bold transition-all ${blocks.find(b => b.id === editingBlockId)?.settings?.align === align ? 'bg-amber-600 border-amber-600 text-white' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}
                         >
                            {align.toUpperCase()}
                         </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>
          
          <div className="mt-8 flex justify-end">
             <button 
                onClick={() => setEditingBlockId(null)}
                className="bg-amber-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-600/20 flex items-center gap-2 hover:bg-amber-700 transition-all"
             >
                <Check size={18}/> Done Editing
             </button>
          </div>
        </div>
      )}

      {/* Bottom Bar Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
         <h3 className="font-bold text-gray-900 dark:text-white mb-4">Footer Bottom Bar</h3>
         <div className="flex gap-4">
            <div className="flex-1">
               <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Copyright Text</label>
               <input 
                  type="text" 
                  value={bottomText}
                  onChange={e => setBottomText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
               />
            </div>
         </div>
      </div>

      {/* Add Block Modal/Overlay */}
      {showAddMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddMenu(false)} />
           <div className="relative bg-white dark:bg-gray-900 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 p-8">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a Block Type</h3>
                 <button onClick={() => setShowAddMenu(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <X size={24}/>
                 </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {BLOCK_TYPES.map((type) => (
                    <button
                       key={type.type}
                       onClick={() => handleAddBlock(type)}
                       className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all text-left group"
                    >
                       <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform">
                          <type.icon size={24} />
                       </div>
                       <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{type.label}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{type.description}</p>
                       </div>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FooterBuilder;
