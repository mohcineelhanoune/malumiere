
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ParallaxBannerProps {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  onCtaClick?: () => void;
}

const ParallaxBanner: React.FC<ParallaxBannerProps> = ({ image, title, subtitle, cta, onCtaClick }) => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform transition-transform duration-700"
        style={{ 
          backgroundImage: `url(${image})`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center p-8">
        <div className="max-w-2xl text-white transform transition-transform duration-500 translate-y-0 group-hover:-translate-y-2">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.2em] uppercase bg-amber-500/90 text-white rounded-full animate-in fade-in zoom-in duration-700">
            Exclusive Collection
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg animate-in slide-in-from-bottom-8 duration-700 delay-100">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed drop-shadow-md animate-in slide-in-from-bottom-8 duration-700 delay-200">
            {subtitle}
          </p>
          <button 
            onClick={onCtaClick}
            className="group inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-xl hover:shadow-amber-500/30 animate-in slide-in-from-bottom-8 duration-700 delay-300"
          >
            {cta}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParallaxBanner;
