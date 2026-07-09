import React, { useState } from 'react';
import { Leaf, Flame, HeartPulse, CookingPot, Truck, Package, HelpCircle } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/products';

const ICON_MAP = {
  Leaf: Leaf,
  Flame: Flame,
  HeartPulse: HeartPulse,
  CookingPot: CookingPot,
  Truck: Truck,
  Package: Package
};

export default function WhyChooseUs() {
  const [flippedCardId, setFlippedCardId] = useState(null);

  const handleCardClick = (id) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  // Deep dive information details
  const deepDives = {
    1: "We source our grains from certified dryland farmers in Southern India. No artificial pesticides or synthetic fertilizers are ever used, preserving the maximum natural mineral profile of each millet grain.",
    2: "Millets are inherently high in amino acids and gluten-free protein. Our proprietary processing methods guarantee up to 2x more protein density per serving than polished white basmati rice, sustaining your athletic goals.",
    3: "Thanks to dense layers of complex dietary fiber, our millets release energy gradually into the bloodstream (extremely low GI Index). This prevents blood glucose spikes and ensures active, all-day fat burning.",
    4: "Every single spice blend and premix formula is developed in tandem with grandma cooks. We slow-roast spices at precise low temperatures to preserve their natural volatile oils and authentic regional flavor profiles.",
    5: "We ship orders within 4 hours of payment. Using premier logistics partnerships, fresh packages are delivered within 24-48 hours across Tier 1 cities with live text updates.",
    6: "Our special 3-layer, food-safe aluminum foil zips block out light, oxygen, and ambient humidity. This extends the product shelf life naturally for 12 months without adding synthetic chemical preservatives."
  };

  return (
    <section id="about" className="py-20 bg-cream/20 dark:bg-cream-dark/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-xs uppercase tracking-widest font-extrabold text-primary dark:text-success-light bg-primary/10 px-3.5 py-1.5 rounded-full">
            Our Quality
          </span>
          <h2 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream mt-3">
            Why Fitness Pros Choose Us
          </h2>
          <p className="text-sm text-textLight dark:text-cream/50 mt-2 font-semibold">
            Click any premium nutrition card below to explore the natural health science.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || HelpCircle;
            const isFlipped = flippedCardId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className="group relative cursor-pointer min-h-[220px] rounded-3xl overflow-hidden transition-all duration-300 transform hover:shadow-premium-hover scale-100 hover:scale-[1.02] border border-accent/15 dark:border-accent/5 bg-white dark:bg-darkCard p-6 flex flex-col justify-between"
                data-aos="fade-up"
                data-aos-delay={idx * 80}
              >
                {/* Standard Face */}
                <div className={`space-y-4 transition-opacity duration-300 ${isFlipped ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
                  {/* Icon Wrapper */}
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:bg-success/20 dark:text-success-light flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-cream">
                    <IconComponent size={24} />
                  </div>

                  <div>
                    <h3 className="font-outfit font-black text-lg text-textDark dark:text-cream group-hover:text-primary dark:group-hover:text-success-light transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-textLight dark:text-cream/60 mt-1.5 leading-relaxed font-semibold">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Flipped Deep Dive Face */}
                <div className={`space-y-3 transition-opacity duration-300 flex flex-col justify-center h-full ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}>
                  <span className="text-[10px] font-extrabold text-primary dark:text-success-light uppercase tracking-widest">
                    Natural Health Science
                  </span>
                  <p className="text-xs sm:text-sm text-textDark dark:text-cream font-medium leading-relaxed">
                    {deepDives[item.id]}
                  </p>
                  <span className="text-[9px] text-textLight dark:text-cream/50 underline font-semibold mt-1">
                    Click card to return
                  </span>
                </div>

                {/* Bottom Card Action Link */}
                {!isFlipped && (
                  <div className="text-[10px] font-extrabold text-primary dark:text-success-light uppercase tracking-widest pt-4 border-t border-accent/5 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore details</span>
                    <span>→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
