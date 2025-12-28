
import React, { useState, useRef } from 'react';
import { BannerSlide } from '../types';
import { 
  Image as ImageIcon, Save, X, AlignLeft, AlignCenter, AlignRight,
  Upload, Sparkles, ArrowRight
} from 'lucide-react';

interface BannerBuilderProps {
  onSave: (slide: BannerSlide) => void;
  onCancel: () => void;
}

const BannerBuilder: React.FC<BannerBuilderProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<BannerSlide>>({
    title: 'New Collection',
    subtitle: 'Discover our latest arrivals for the season.',
    cta: 'Shop Now',
    image: '',
    align: 'left'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.image) return;
    
    const newSlide: BannerSlide = {
      id: Date.now(),
      title: formData.title,
      subtitle: formData.subtitle || '',
      cta: formData.cta || 'Shop Now',
      image: formData.image,
      align: formData.align || 'left',
      link: formData.link
    };

    onSave(newSlide);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="bg-amber-600 text-white p-2 rounded-lg"><Sparkles className="h-6 w-6" /></span>
              Banner Builder
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Design stunning homepage banners for your store.</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Form */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="space-y-4">
                
                {/* Image Input */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banner Image</label>
                   <div className="flex gap-4">
                      <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 justify-center"
                             >
                                <Upload className="h-4 w-4" />
                                Upload Image
                             </button>
                             <input 
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept="image/*"
                             />
                          </div>
                          <div className="text-center text-xs text-gray-400 my-2">- OR -</div>
                          <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Paste Image URL"
                                value={formData.image}
                                onChange={e => setFormData({...formData, image: e.target.value})}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white text-sm"
                            />
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                      </div>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Summer Collection"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                  <textarea 
                    rows={2}
                    value={formData.subtitle}
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    placeholder="Brief description..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
                        <input 
                            type="text" 
                            value={formData.cta}
                            onChange={e => setFormData({...formData, cta: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text Alignment</label>
                        <div className="flex bg-gray-50 dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
                           {['left', 'center', 'right'].map((align) => (
                               <button
                                  key={align}
                                  onClick={() => setFormData({...formData, align: align as any})}
                                  className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${
                                      formData.align === align 
                                      ? 'bg-white dark:bg-gray-700 text-amber-600 shadow-sm' 
                                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                  }`}
                               >
                                   {align === 'left' && <AlignLeft className="h-4 w-4" />}
                                   {align === 'center' && <AlignCenter className="h-4 w-4" />}
                                   {align === 'right' && <AlignRight className="h-4 w-4" />}
                               </button>
                           ))}
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
               <button 
                  onClick={onCancel}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
               >
                  Cancel
               </button>
               <button 
                  onClick={handleSave}
                  disabled={!formData.title || !formData.image}
                  className="px-8 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <Save className="h-5 w-5" />
                  Save Banner
               </button>
            </div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="flex justify-center w-full">
             <div className="w-full sticky top-8">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Live Preview</h3>
                
                <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl group border border-gray-200 dark:border-gray-800">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
                        {formData.image ? (
                            <>
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <ImageIcon className="h-12 w-12 mb-2" />
                                <span>Image Preview</span>
                            </div>
                        )}
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex items-center p-8">
                        <div className={`w-full max-w-lg text-white ${
                            formData.align === 'right' ? 'ml-auto text-right' : 
                            formData.align === 'center' ? 'mx-auto text-center' : 'text-left'
                        }`}>
                            <span className="inline-block px-3 py-1 mb-2 text-[10px] md:text-xs font-bold tracking-wider uppercase bg-amber-500/90 text-white rounded-full">
                                Featured
                            </span>
                            <h2 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
                                {formData.title || 'Banner Title'}
                            </h2>
                            <p className="text-sm md:text-base text-gray-200 mb-4 leading-relaxed line-clamp-2">
                                {formData.subtitle || 'Banner subtitle description goes here...'}
                            </p>
                            <button className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-bold hover:bg-amber-500 hover:text-white transition-all shadow-lg">
                                {formData.cta || 'Button'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BannerBuilder;
