
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
interface BannerSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  align?: 'left' | 'center' | 'right';
}

interface BannerSliderProps {
  slides: BannerSlide[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isAutoPlaying && slides.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden shadow-2xl group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transform scale-105 transition-transform duration-[10000ms] ease-out"
              style={{ 
                transform: index === currentSlide ? 'scale(1.1)' : 'scale(1.0)' 
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent dark:from-black/80 dark:via-black/60 dark:to-black/30" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center p-8 md:p-16">
            <div className={`max-w-7xl mx-auto w-full flex ${
              slide.align === 'right' ? 'justify-end text-right' : 
              slide.align === 'center' ? 'justify-center text-center' : 'justify-start text-left'
            }`}>
              <div className="max-w-xl text-white">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase bg-amber-500/90 text-white rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  Featured Collection
                </span>
                <h2 className="text-5xl md:text-7xl font-bold mb-4 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  {slide.subtitle}
                </p>
                <button className="group inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-amber-500 hover:text-white transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 shadow-lg hover:shadow-amber-500/25">
                  {slide.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 bg-amber-500' 
                : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
