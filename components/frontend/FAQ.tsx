
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const FAQ_DATA = [
  {
    category: 'General',
    question: "Do you have a physical store?",
    answer: "Yes, we have a flagship store located at 123 Innovation Drive, Tech Valley. You can visit us Monday through Saturday from 10 AM to 8 PM."
  },
  {
    category: 'General',
    question: "How do I create an account?",
    answer: "Click on the 'Sign Up' button in the top right corner of the page. Fill in your details including name, email, and password to create your account instantly."
  },
  {
    category: 'Shipping',
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number. You can also track your order directly from your Client Dashboard under the 'Track Order' tab."
  },
  {
    category: 'Shipping',
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and times vary depending on the destination."
  },
  {
    category: 'Payment',
    question: "What payment methods do you accept?",
    answer: "We accept Visa, MasterCard, PayPal, and Cash on Delivery (for select locations)."
  },
  {
    category: 'Returns',
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unused items in their original packaging. Please visit our Shipping & Returns page for more details."
  }
];

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'General', 'Shipping', 'Payment', 'Returns'];

  const filteredFAQs = FAQ_DATA.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <div className="bg-amber-100 dark:bg-amber-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600 dark:text-amber-500">
           <HelpCircle className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('faq')}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('faqSubtitle')}
        </p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-6 mb-12">
         <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-amber-500 outline-none text-lg"
            />
         </div>

         <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                     activeCategory === cat 
                     ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' 
                     : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
               >
                  {cat}
               </button>
            ))}
         </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
         {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
               <p>No results found for "{searchTerm}"</p>
            </div>
         ) : (
            filteredFAQs.map((item, index) => (
               <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300"
               >
                  <button
                     onClick={() => toggleAccordion(index)}
                     className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                     <span className="font-bold text-lg text-gray-900 dark:text-white">{item.question}</span>
                     {openIndex === index ? (
                        <ChevronUp className="h-5 w-5 text-amber-600" />
                     ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                     )}
                  </button>
                  
                  <div 
                     className={`px-6 text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${
                        openIndex === index ? 'max-h-96 py-5 border-t border-gray-100 dark:border-gray-700' : 'max-h-0'
                     }`}
                  >
                     {item.answer}
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
};

export default FAQ;
