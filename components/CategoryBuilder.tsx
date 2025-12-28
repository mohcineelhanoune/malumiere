
import React, { useState, useRef } from 'react';
import { Category } from '../types';
import { 
  Wand2, Image as ImageIcon, Save, X, RefreshCw, 
  Sparkles, Check, Upload, Trash2 
} from 'lucide-react';
import { generateAiGallery } from '../services/mockAi';

interface CategoryBuilderProps {
  onSave: (category: Category) => void;
  onCancel: () => void;
}

const CategoryBuilder: React.FC<CategoryBuilderProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    image: '',
  });
  const [loadingAiImage, setLoadingAiImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = async () => {
    if (!formData.name) return;
    setLoadingAiImage(true);
    try {
      // Reusing gallery generator to get an image relevant to the name
      const newImages = await generateAiGallery(formData.name);
      if (newImages.length > 0) {
        setFormData(prev => ({ ...prev, image: newImages[0] }));
      }
    } finally {
      setLoadingAiImage(false);
    }
  };

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

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!formData.name || !formData.image) return;
    
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: formData.name,
      image: formData.image,
      description: formData.description || '',
    };

    onSave(newCategory);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="bg-amber-600 text-white p-2 rounded-lg"><Sparkles className="h-6 w-6" /></span>
              Add New Category
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Create a new product category for your store.</p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Smart Wearables"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the category..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white resize-none"
                  />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Image</label>
                   
                   <div className="flex gap-4 items-start">
                      <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                             <button 
                                onClick={handleGenerateImage}
                                disabled={loadingAiImage || !formData.name}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex-1 justify-center"
                             >
                                {loadingAiImage ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                                AI Generate
                             </button>
                             
                             <button 
                                onClick={triggerFileUpload}
                                className="flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex-1 justify-center"
                             >
                                <Upload className="h-4 w-4" />
                                Upload
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
                  disabled={!formData.name || !formData.image}
                  className="px-8 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <Save className="h-5 w-5" />
                  Save Category
               </button>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="flex justify-center">
             <div className="w-full max-w-sm">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Preview</h3>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 group relative">
                    <div className="aspect-square bg-gray-50 dark:bg-gray-800 relative">
                      {formData.image ? (
                         <img src={formData.image} alt={formData.name} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                            <span>No Image</span>
                         </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="p-6 text-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {formData.name || 'Category Name'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {formData.description || 'Category description...'}
                        </p>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryBuilder;
