
import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Wand2, Image as ImageIcon, Save, X, RefreshCw, 
  Sparkles, Check, ChevronRight, Upload, Trash2 
} from 'lucide-react';
import { generateAiDescription, generateAiGallery } from '../services/mockAi';
import { formatCurrency } from '../services/mockData';

interface ProductBuilderProps {
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductBuilder: React.FC<ProductBuilderProps> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loadingAiText, setLoadingAiText] = useState(false);
  const [loadingAiImages, setLoadingAiImages] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    originalPrice: 0,
    category: 'Electronics',
    description: '',
    image: '',
    images: [],
    rating: { rate: 4.5, count: 0 }
  });

  const [keywords, setKeywords] = useState('');

  const handleGenerateDescription = async () => {
    if (!formData.title) return;
    setLoadingAiText(true);
    try {
      const desc = await generateAiDescription(
        formData.title, 
        formData.category || 'General', 
        keywords
      );
      setFormData(prev => ({ ...prev, description: desc }));
    } finally {
      setLoadingAiText(false);
    }
  };

  const handleGenerateGallery = async () => {
    setLoadingAiImages(true);
    try {
      const newImages = await generateAiGallery(formData.category || 'General');
      setFormData(prev => ({ 
        ...prev, 
        image: newImages[0], // Set first image as main
        images: newImages 
      }));
    } finally {
      setLoadingAiImages(false);
    }
  };

  const handleAddImageUrl = (url: string) => {
    if (!url) return;
    setFormData(prev => ({
      ...prev,
      image: prev.image || url,
      images: [...(prev.images || []), url]
    }));
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages,
      image: index === 0 && newImages.length > 0 ? newImages[0] : (newImages.length === 0 ? '' : prev.image)
    }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.price || !formData.image) return;
    
    // Construct final product
    const newProduct: Product = {
      id: Date.now(), // Temporary ID
      title: formData.title,
      price: formData.price,
      originalPrice: formData.originalPrice,
      category: formData.category || 'Uncategorized',
      description: formData.description || '',
      image: formData.image,
      images: formData.images,
      rating: { rate: 0, count: 0 }
    };

    onSave(newProduct);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="bg-amber-600 text-white p-2 rounded-lg"><Sparkles className="h-6 w-6" /></span>
              AI Product Builder
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Create rich product listings with artificial intelligence.</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Builder Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Basic Info */}
            <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 ${step === 1 ? 'ring-2 ring-amber-500' : 'opacity-80'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">1</span>
                  Basic Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Ultra Smart Watch Series 5"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Price</label>
                    <input 
                      type="number" 
                      value={formData.originalPrice}
                      onChange={e => setFormData({...formData, originalPrice: parseFloat(e.target.value)})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: AI Description */}
            <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 ${step === 2 ? 'ring-2 ring-amber-500' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">2</span>
                  AI Description
                </h3>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      placeholder="Keywords (e.g. fast, sleek)" 
                      value={keywords}
                      onChange={e => setKeywords(e.target.value)}
                      className="text-sm px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none dark:text-white"
                   />
                   <button 
                      onClick={handleGenerateDescription}
                      disabled={loadingAiText || !formData.title}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                   >
                      {loadingAiText ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      Generate
                   </button>
                </div>
              </div>
              
              <textarea 
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Product description will appear here..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none resize-none dark:text-white"
              />
            </div>

             {/* Step 3: AI Gallery */}
             <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 ${step === 3 ? 'ring-2 ring-amber-500' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">3</span>
                  Smart Gallery
                </h3>
                <button 
                  onClick={handleGenerateGallery}
                  disabled={loadingAiImages}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                >
                  {loadingAiImages ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                  Generate Images
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                 {formData.images && formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                       <img src={img} alt="" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                             onClick={() => setFormData(prev => ({ ...prev, image: img }))}
                             className={`p-1.5 rounded-full ${formData.image === img ? 'bg-amber-500 text-white' : 'bg-white text-gray-800'}`}
                             title="Set as Main"
                          >
                             <Check className="h-4 w-4" />
                          </button>
                          <button 
                             onClick={() => removeImage(idx)}
                             className="p-1.5 bg-white text-red-500 rounded-full hover:bg-red-50"
                             title="Remove"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                    </div>
                 ))}
                 
                 {/* Add manual image */}
                 <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-4 text-gray-400 hover:text-amber-500 hover:border-amber-500 transition-colors cursor-pointer relative">
                    <Upload className="h-8 w-8 mb-2" />
                    <span className="text-xs text-center">Add URL</span>
                    <input 
                       type="text" 
                       className="absolute inset-0 opacity-0 cursor-pointer"
                       onChange={(e) => {
                          if (e.target.value) {
                             handleAddImageUrl(e.target.value);
                             e.target.value = ''; // Reset
                          }
                       }}
                    />
                 </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-4 pt-4">
               <button 
                  onClick={onCancel}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
               >
                  Cancel
               </button>
               <button 
                  onClick={handleSave}
                  className="px-8 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
               >
                  <Save className="h-5 w-5" />
                  Save Product
               </button>
            </div>

          </div>

          {/* Right Column: Live Preview */}
          <div className="hidden lg:block">
             <div className="sticky top-8">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Live Preview</h3>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                   <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-800 relative flex items-center justify-center">
                      {formData.image ? (
                         <img src={formData.image} alt={formData.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-4" />
                      ) : (
                         <div className="text-gray-400 flex flex-col items-center">
                            <ImageIcon className="h-12 w-12 mb-2" />
                            <span>No Image</span>
                         </div>
                      )}
                      <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 text-xs font-bold rounded shadow-sm text-gray-600 dark:text-gray-300">
                         {formData.category || 'Category'}
                      </span>
                   </div>
                   <div className="p-5">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                         {formData.title || 'Product Title'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                         {formData.description || 'Product description will appear here...'}
                      </p>
                      <div className="flex items-center justify-between">
                         <div className="flex flex-col">
                            {formData.originalPrice ? (
                               <span className="text-xs text-gray-400 line-through">
                                  {formatCurrency(formData.originalPrice)}
                               </span>
                            ) : null}
                            <span className="text-xl font-bold text-amber-600">
                               {formatCurrency(formData.price || 0)}
                            </span>
                         </div>
                         <button className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold">
                            Add
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

export default ProductBuilder;
