
import React from 'react';
import { FooterConfig, FooterBlock } from '../../types';
import {
  Facebook, Instagram, Mail, Phone, MapPin,
  Send, Lamp, ArrowRight, Twitter, Youtube
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DynamicFooterProps {
  config: FooterConfig | null;
}

const DynamicFooter: React.FC<DynamicFooterProps> = ({ config }) => {
  const { t } = useLanguage();

  if (!config || !config.blocks || config.blocks.length === 0) {
    return (
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-12 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Ma Lumière. All rights reserved.</p>
      </footer>
    );
  }

  const renderBlock = (block: FooterBlock) => {
    const alignClass = block.settings?.align === 'center' ? 'text-center' : block.settings?.align === 'right' ? 'text-right' : 'text-left';

    switch (block.type) {
      case 'text':
        return (
          <div key={block.id} className={`space-y-4 ${alignClass}`}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">{block.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{block.content}</p>
          </div>
        );

      case 'links':
        return (
          <div key={block.id} className={`space-y-4 ${alignClass}`}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">{block.title}</h4>
            <ul className="space-y-2">
              {block.settings?.links?.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} className="text-sm text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'newsletter':
        return (
          <div key={block.id} className={`space-y-4 ${alignClass}`}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">{block.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{block.content}</p>
            <form className="relative mt-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full py-3 px-5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button className="absolute right-1 top-1 bottom-1 bg-amber-600 text-white px-5 rounded-full hover:bg-amber-700 transition-colors">
                <Send size={16} />
              </button>
            </form>
          </div>
        );

      case 'social':
        return (
          <div key={block.id} className={`space-y-4 ${alignClass}`}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">{block.title}</h4>
            <div className={`flex gap-4 ${block.settings?.align === 'center' ? 'justify-center' : block.settings?.align === 'right' ? 'justify-end' : 'justify-start'}`}>
              <a href="#" className="p-2.5 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-600 dark:text-gray-400 hover:bg-amber-600 hover:text-white transition-all"><Facebook size={18} /></a>
              <a href="#" className="p-2.5 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-600 dark:text-gray-400 hover:bg-amber-600 hover:text-white transition-all"><Instagram size={18} /></a>
              <a href="#" className="p-2.5 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-600 dark:text-gray-400 hover:bg-amber-600 hover:text-white transition-all"><Twitter size={18} /></a>
              <a href="#" className="p-2.5 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-600 dark:text-gray-400 hover:bg-amber-600 hover:text-white transition-all"><Youtube size={18} /></a>
            </div>
          </div>
        );

      case 'image':
        return (
          <div key={block.id} className={`space-y-4 ${alignClass}`}>
            {block.settings?.imageUrl ? (
              <img src={block.settings.imageUrl} alt={block.title} className={`max-h-20 h-auto ${block.settings?.align === 'center' ? 'mx-auto' : block.settings?.align === 'right' ? 'ml-auto' : ''}`} />
            ) : (
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-900 rounded flex items-center justify-center">
                <Lamp className="text-amber-600 opacity-20" />
              </div>
            )}

          </div>
        );

      case 'html':
        return (
          <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content || '' }} className={alignClass} />
        );

      default:
        return null;
    }
  };

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {config.blocks.map(renderBlock)}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-600 font-medium tracking-wide">
            {config.bottomText}
          </p>
          <div className="flex gap-6 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            <a href="#" className="hover:text-amber-600">Privacy Policy</a>
            <a href="#" className="hover:text-amber-600">Terms of Service</a>
            <a href="#" className="hover:text-amber-600">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DynamicFooter;
