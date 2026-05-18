import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto scroll effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveIndex(prev => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="testimonials" className="py-20 bg-cream/40 dark:bg-cream-dark/5 overflow-hidden scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Abstract Background Quote */}
        <Quote className="absolute top-0 left-4 text-primary/10 dark:text-success/5 w-32 h-32 pointer-events-none transform -translate-y-8 -translate-x-4" />

        {/* Heading */}
        <div className="text-center mb-12" data-aos="fade-up">
          <span className="text-xs uppercase tracking-widest font-extrabold text-primary dark:text-success-light bg-primary/10 px-3.5 py-1.5 rounded-full">
            Real Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream mt-3">
            What Fitness Lovers Say
          </h2>
        </div>

        {/* Testimonial Active Slide */}
        <div className="relative min-h-[380px] sm:min-h-[260px] md:min-h-[220px] flex items-center justify-center" data-aos="zoom-in" data-aos-duration="600">
          
          {TESTIMONIALS.map((t, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={t.id}
                className={`w-full bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 p-6 sm:p-10 shadow-premium transition-all duration-700 absolute ${
                  isActive
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Photo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-premium flex-shrink-0">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Testimony Details */}
                  <div className="text-center sm:text-left flex-grow space-y-3">
                    {/* Stars */}
                    <div className="flex justify-center sm:justify-start gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-highlight text-highlight" />
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-sm sm:text-base italic font-semibold text-textDark dark:text-cream leading-relaxed">
                      "{t.review}"
                    </p>

                    {/* Name & Role */}
                    <div>
                      <h4 className="font-outfit font-extrabold text-sm sm:text-base text-primary dark:text-success-light">
                        {t.name}
                      </h4>
                      <p className="text-xs text-textLight dark:text-cream/50 font-bold uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center items-center gap-4 mt-8 sm:mt-12 z-20 relative">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-white dark:bg-darkCard hover:bg-primary hover:text-cream border border-accent/15 text-textDark dark:text-cream transition-all scale-100 active:scale-90 shadow-premium"
            aria-label="Previous Review"
          >
            <ChevronLeft size={16} />
          </button>
          
          {/* Progress dots */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === idx ? 'w-6 bg-primary dark:bg-success' : 'w-2 bg-accent/30 hover:bg-accent'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2.5 rounded-full bg-white dark:bg-darkCard hover:bg-primary hover:text-cream border border-accent/15 text-textDark dark:text-cream transition-all scale-100 active:scale-90 shadow-premium"
            aria-label="Next Review"
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
