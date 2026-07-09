import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-cream/40 dark:bg-cream-dark/5 overflow-hidden scroll-mt-20">
      {/* Self-contained CSS styles for infinite scroll */}
      <style>{`
        @keyframes scrollMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-stream {
          display: flex;
          width: max-content;
          animation: scrollMarquee 45s linear infinite;
        }
        .animate-marquee-stream:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full relative">
        {/* Heading */}
        <div className="text-center mb-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up">
          <span className="text-xs uppercase tracking-widest font-extrabold text-primary dark:text-success-light bg-primary/10 px-3.5 py-1.5 rounded-full">
            Real Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream mt-3">
            What Fitness Lovers Say
          </h2>
        </div>

        {/* Scrolling track container */}
        <div className="w-full overflow-hidden relative py-4">
          {/* Subtle gradient fades on the sides of the viewport for high premium look */}
          <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-cream dark:from-[#121212] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-cream dark:from-[#121212] to-transparent z-10 pointer-events-none" />

          {/* Infinite Marquee stream (Double list for seamless loop) */}
          <div className="animate-marquee-stream flex gap-6">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, index) => (
              <div
                key={`${t.id}-${index}`}
                className="w-[300px] sm:w-[420px] bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 p-6 sm:p-8 shadow-premium flex flex-col justify-between whitespace-normal select-none"
              >
                <div className="space-y-4">
                  {/* Star Rating & Quote Icon */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-highlight text-highlight" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/10 dark:text-success/10 flex-shrink-0" />
                  </div>

                  {/* Review text */}
                  <p className="text-xs sm:text-sm italic font-semibold text-textDark dark:text-cream leading-relaxed font-sans">
                    "{t.review}"
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-accent/5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-premium flex-shrink-0">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-outfit font-black text-sm text-primary dark:text-success-light leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-textLight dark:text-cream/50 font-bold uppercase tracking-wider mt-0.5 leading-none">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
