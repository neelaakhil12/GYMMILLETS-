import React, { useState, useEffect } from 'react';
import { Search, Flame, ShieldCheck, Zap } from 'lucide-react';

const MILLETS = [
  {
    name: "",
    image: "/millet-mix.png",
    alt: "Natural Multi Millet Mix"
  },
  {
    name: "Sorghum (Jowar)",
    image: "/sorghum-jowar.png",
    alt: "Sorghum Jowar"
  },
  {
    name: "Pearl Millet",
    image: "/pearl-millet.png",
    alt: "Pearl Millet"
  },
  {
    name: "Finger Millet",
    image: "/finger-millet.png",
    alt: "Finger Millet"
  },
  {
    name: "Foxtail Millet",
    image: "/foxtail-millet.png",
    alt: "Foxtail Millet"
  },
  {
    name: "Little Millet",
    image: "/little-millet.png",
    alt: "Little Millet"
  }
];

export default function Hero({ setSearchQuery, setActiveView }) {
  const [localSearch, setLocalSearch] = useState('');
  const [currentMilletIndex, setCurrentMilletIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMilletIndex((prev) => (prev + 1) % MILLETS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setActiveView('shop');
    setTimeout(() => {
      const element = document.getElementById('shop-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleShopNowClick = () => {
    setActiveView('shop');
    setTimeout(() => {
      const element = document.getElementById('shop-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleExploreClick = () => {
    const element = document.getElementById('bestsellers');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 sm:pt-40 lg:pt-44 bg-white dark:bg-[#121212] px-4 sm:px-6 lg:px-8">
      {/* Decorative Natural Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-60 h-60 bg-success/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-10">
        {/* Text Content */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6" data-aos="fade-right" data-aos-duration="800">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-success/20 dark:text-success-light font-outfit text-xs sm:text-sm font-semibold tracking-wide border border-primary/20">
            <Flame size={14} className="animate-pulse" />
            <span>100% Pure Natural Millet Nutrition</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-extrabold text-textDark dark:text-cream leading-tight sm:leading-none">
            Healthy Millet Foods
          </h1>
          <p className="text-lg sm:text-xl font-outfit font-semibold text-secondary dark:text-accent-light tracking-wide mt-2">
            Nourish Naturally, Thrive daily
          </p>

          {/* Subheading */}
          <div className="text-base sm:text-lg text-textLight dark:text-cream/70 max-w-xl mx-auto lg:mx-0 font-medium space-y-4">
            <p>
              Experience the power of ancient grains with our premium millet premixes and instant batters, crafted from millets soaked for 12 hours to unlock maximum protein and nutrition.
            </p>
            <p>
              Complete your meal with our trio of signature instant chutneys simply add water for a gourmet, high-protein experience designed for your active lifestyle.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto lg:mx-0 relative mt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4.5 text-textLight dark:text-cream/50 pointer-events-none" size={20} />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search Dosa, Noodles, Moringa..."
                className="w-full pl-12 pr-28 py-3.5 sm:py-4 rounded-full border border-accent/20 bg-white/70 dark:bg-darkCard/60 backdrop-blur-md focus:border-primary focus:outline-none shadow-premium transition-all text-textDark dark:text-cream text-sm font-medium"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-primary dark:bg-success hover:bg-primary-dark dark:hover:bg-success-dark text-cream font-semibold rounded-full px-5 text-xs sm:text-sm transition-all shadow-premium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={handleShopNowClick}
              className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold transition-all shadow-premium hover:shadow-premium-hover scale-100 hover:scale-[1.03] active:scale-95 text-sm sm:text-base"
            >
              Shop Now
            </button>
            <button
              onClick={handleExploreClick}
              className="px-8 py-3.5 rounded-full border border-secondary text-secondary dark:border-accent-light dark:text-accent-light hover:bg-secondary hover:text-cream dark:hover:bg-accent-light dark:hover:text-darkBackground font-bold transition-all text-sm sm:text-base scale-100 hover:scale-[1.03] active:scale-95"
            >
              Explore Products
            </button>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 max-w-lg mx-auto lg:mx-0">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="text-xl sm:text-2xl font-extrabold text-primary dark:text-success-light">25+</span>
              <span className="text-xs text-textLight dark:text-cream/50 font-medium">Millet Blends</span>
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left border-l border-accent/20 pl-2 sm:pl-4">
              <span className="text-xl sm:text-2xl font-extrabold text-secondary dark:text-accent-light">100%</span>
              <span className="text-xs text-textLight dark:text-cream/50 font-medium">Gluten Free</span>
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left border-l border-accent/20 pl-2 sm:pl-4">
              <span className="text-xl sm:text-2xl font-extrabold text-highlight">5 Star</span>
              <span className="text-xs text-textLight dark:text-cream/50 font-medium">Reviews Only</span>
            </div>
          </div>
        </div>

        {/* Floating Animation Image Section */}
        <div className="lg:col-span-5 relative flex justify-center items-center h-[380px] sm:h-[480px] lg:h-[500px]" data-aos="zoom-in" data-aos-duration="1000">
          {/* Main Hero Circle Background */}
          <div className="absolute w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-tr from-primary to-accent opacity-20 animate-pulse pointer-events-none" />
          
          {/* Center Main Product Image Slideshow */}
          <div className="relative z-10 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full border-[6px] border-white dark:border-darkCard shadow-premium bg-white/60 dark:bg-darkBackground/60 flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img
                src={MILLETS[currentMilletIndex].image}
                alt={MILLETS[currentMilletIndex].alt}
                className="w-full h-full object-contain p-1"
                loading="eager"
              />
            </div>
            {/* Dynamic Active Millet Name Badge */}
            {MILLETS[currentMilletIndex].name && (
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/95 dark:bg-darkCard/95 backdrop-blur-md px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-accent/20 shadow-premium transition-all duration-300">
                <span className="text-[10px] sm:text-xs font-extrabold text-primary dark:text-success-light uppercase tracking-wider block whitespace-nowrap">
                  {MILLETS[currentMilletIndex].name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
