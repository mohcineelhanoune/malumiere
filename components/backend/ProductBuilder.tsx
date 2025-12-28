
import React, { useState, useEffect } from 'react';
import { Product, Category } from '../../types';
import { 
  Wand2, Image as ImageIcon, Save, X, RefreshCw, 
  Sparkles, Check, ChevronRight, Upload, Trash2, FileText, Plus
} from 'lucide-react';
import { generateAiDescription, generateAiGallery } from '../../services/mockAi';
import { formatCurrency } from '../../services/mockData';
import { fetchCategoriesFromDB } from '../../services/db';

interface ProductBuilderProps {
  initialData?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductBuilder: React.FC<ProductBuilderProps> = ({ initialData, onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loadingAiText, setLoadingAiText] = useState(false);
  const [loadingAiImages, setLoadingAiImages] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    originalPrice: 0,
    category: '',
    description: '',
    image: '',
    images: [],
    rating: { rate: 4.5, count: 0 },
    stock: 10,
    ft_url: '',
    fi_url: ''
  });

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
        const cats = await fetchCategoriesFromDB();
        setCategories(cats);
        
        // Set default category if not set and categories exist
        if (!formData.category && cats.length > 0) {
            setFormData(prev => ({ ...prev, category: cats[0].name }));
        }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
        setFormData({
            ...initialData,
            images: initialData.images || [],
            originalPrice: initialData.originalPrice || 0,
            stock: initialData.stock || 10
        });
    }
  }, [initialData]);

  const [keywords, setKeywords] = useState('');
  const [manualImageUrl, setManualImageUrl] = useState('');

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
        image: prev.image || newImages[0], 
        images: newImages 
      }));
    } finally {
      setLoadingAiImages(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!manualImageUrl) return;
    setFormData(prev => ({
      ...prev,
      image: prev.image || manualImageUrl,
      images: [...(prev.images || []), manualImageUrl]
    }));
    setManualImageUrl('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({
          ...prev,
          image: prev.image || result,
          images: [...(prev.images || []), result]
        }));
      };
      reader.readAsDataURL(file);
    }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'ft_url' | 'fi_url') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.title || formData.price === undefined || !formData.image) {
        alert("Veuillez remplir le titre, le prix et l'image principale.");
        return;
    }
    
    const productData: Product = {
      id: initialData ? initialData.id : Date.now(), 
      title: formData.title,
      price: formData.price,
      originalPrice: formData.originalPrice || undefined,
      category: formData.category || 'Uncategorized',
      description: formData.description || '',
      image: formData.image,
      images: formData.images || [],
      rating: formData.rating || { rate: 0, count: 0 },
      stock: formData.stock !== undefined ? formData.stock : 10,
      ft_url: formData.ft_url,
      fi_url: formData.fi_url
    };

    onSave(productData);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <span className="bg-amber-600 text-white p-2 rounded-lg"><Sparkles className="h-6 w-6" /></span>
              {initialData ? 'Modifier le Produit' : 'AI Product Builder'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                {initialData ? `Modification de : ${initialData.title}` : 'Créez des fiches produits riches avec l\'intelligence artificielle.'}
            </p>
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
            <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300 ring-amber-500`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">1</span>
                  Informations de Base
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre du Produit</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="ex: Suspension LEON GOLD"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                  >
                    <option value="" disabled>Sélectionner une catégorie</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    {categories.length === 0 && <option value="General">General</option>}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prix (MAD)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ancien Prix</label>
                    <input 
                      type="number" 
                      value={formData.originalPrice}
                      onChange={e => setFormData({...formData, originalPrice: parseFloat(e.target.value) || 0})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                    />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantité Stock</label>
                    <input 
                      type="number" 
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none dark:text-white"
                    />
                </div>
              </div>
            </div>

            {/* Additional Files / Resources */}
            <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ressources & Fiches PDF</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fiche Technique (URL/File)</label>
                     <div className="flex gap-2">
                        <input 
                           type="text"
                           placeholder="URL ou Upload"
                           value={formData.ft_url || ''}
                           onChange={e => setFormData({...formData, ft_url: e.target.value})}
                           className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none dark:text-white text-sm"
                        />
                        <label className="cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-lg">
                           <Upload className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                           <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'ft_url')} />
                        </label>
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fiche d'Instruction (URL/File)</label>
                     <div className="flex gap-2">
                        <input 
                           type="text"
                           placeholder="URL ou Upload"
                           value={formData.fi_url || ''}
                           onChange={e => setFormData({...formData, fi_url: e.target.value})}
                           className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none dark:text-white text-sm"
                        />
                        <label className="cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 p-2 rounded-lg">
                           <Upload className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                           <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'fi_url')} />
                        </label>
                     </div>
                  </div>
               </div>
            </div>

            {/* Step 2: AI Description */}
            <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">2</span>
                  Description AI
                </h3>
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      placeholder="Mots-clés (ex: luxe, doré)" 
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
                      Générer
                   </button>
                </div>
              </div>
              
              <textarea 
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="La description générée apparaîtra ici..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 outline-none resize-none dark:text-white"
              />
            </div>

             {/* Step 3: Images & Gallery */}
             <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">3</span>
                  Images & Galerie
                </h3>
                <button 
                  onClick={handleGenerateGallery}
                  disabled={loadingAiImages}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                >
                  {loadingAiImages ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                  Images AI
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                 {/* Existing Images */}
                 {formData.images && formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                       <img src={img} alt="" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                             onClick={() => setFormData(prev => ({ ...prev, image: img }))}
                             className={`p-1.5 rounded-full ${formData.image === img ? 'bg-amber-500 text-white' : 'bg-white text-gray-800'}`}
                             title="Définir comme principale"
                          >
                             <Check className="h-4 w-4" />
                          </button>
                          <button 
                             onClick={() => removeImage(idx)}
                             className="p-1.5 bg-white text-red-500 rounded-full hover:bg-red-50"
                             title="Supprimer"
                          >
                             <Trash2 className="h-4 w-4" />
                          </button>
                       </div>
                    </div>
                 ))}
                 
                 {/* Upload Button Box */}
                 <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-4 text-gray-400 hover:text-amber-500 hover:border-amber-500 transition-colors cursor-pointer relative group">
                    <Upload className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-center font-medium">Uploader</span>
                    <input 
                       type="file" 
                       accept="image/*"
                       className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                       onChange={handleImageUpload}
                    />
                 </div>
              </div>

              {/* Manual URL Input */}
              <div className="flex gap-2">
                  <input 
                      type="text"
                      placeholder="Ou collez une URL d'image ici..."
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddImageUrl()}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none dark:text-white text-sm"
                  />
                  <button 
                      onClick={handleAddImageUrl}
                      disabled={!manualImageUrl}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                  >
                      Ajouter
                  </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-4 pt-4">
               <button 
                  onClick={onCancel}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
               >
                  Annuler
               </button>
               <button 
                  onClick={handleSave}
                  className="px-8 py-3 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2"
               >
                  <Save className="h-5 w-5" />
                  {initialData ? 'Mettre à jour' : 'Enregistrer le Produit'}
               </button>
            </div>

          </div>

          {/* Right Column: Live Preview */}
          <div className="hidden lg:block">
             <div className="sticky top-8">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Aperçu en Direct</h3>
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                   <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-800 relative flex items-center justify-center">
                      {formData.image ? (
                         <img src={formData.image} alt={formData.title} className="w-full h-full object-cover p-0" />
                      ) : (
                         <div className="text-gray-400 flex flex-col items-center">
                            <ImageIcon className="h-12 w-12 mb-2" />
                            <span>Pas d'image</span>
                         </div>
                      )}
                      <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 text-xs font-bold rounded shadow-sm text-gray-600 dark:text-gray-300">
                         {formData.category || 'Catégorie'}
                      </span>
                   </div>
                   <div className="p-5">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                         {formData.title || 'Nom du Produit'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                         {formData.description || 'La description apparaîtra ici...'}
                      </p>
                      
                      <div className="mb-2">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded ${formData.stock && formData.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {formData.stock && formData.stock > 0 ? `En Stock (${formData.stock})` : 'Rupture'}
                         </span>
                      </div>

                      <div className="flex items-center justify-between">
                         <div className="flex flex-col">
                            {formData.originalPrice && formData.originalPrice > 0 ? (
                               <span className="text-xs text-gray-400 line-through">
                                  {formatCurrency(formData.originalPrice)}
                               </span>
                            ) : null}
                            <span className="text-xl font-bold text-amber-600">
                               {formatCurrency(formData.price || 0)}
                            </span>
                         </div>
                         <button className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold">
                            Ajouter
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
