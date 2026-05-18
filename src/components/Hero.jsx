import React, { useState } from 'react';
import { Search, Flame, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ setSearchQuery, setActiveView }) {
  const [localSearch, setLocalSearch] = useState('');

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-br from-cream via-[#F4EFE6] to-[#ECE5D9] dark:from-[#121212] dark:via-[#1A1A1A] dark:to-[#161412] px-4 sm:px-6 lg:px-8">
      {/* Decorative Organic Blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-60 h-60 bg-success/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-10">
        {/* Text Content */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6" data-aos="fade-right" data-aos-duration="800">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-success/20 dark:text-success-light font-outfit text-xs sm:text-sm font-semibold tracking-wide border border-primary/20">
            <Flame size={14} className="animate-pulse" />
            <span>100% Pure Organic Millet Nutrition</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-outfit font-extrabold text-textDark dark:text-cream leading-tight sm:leading-none">
            Healthy Millet Foods <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary via-secondary to-highlight bg-clip-text text-transparent dark:from-success-light dark:via-accent-light dark:to-highlight-light">
              Delivered Fresh
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-textLight dark:text-cream/70 max-w-xl mx-auto lg:mx-0 font-medium">
            Discover premium millet premixes, powders, soups, noodles, and healthy products made for modern active living. Protein-rich, high-fiber, and delicious!
          </p>

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
        <div className="lg:col-span-5 relative flex justify-center items-center h-[350px] sm:h-[450px]" data-aos="zoom-in" data-aos-duration="1000">
          {/* Main Hero Circle Background */}
          <div className="absolute w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] rounded-full bg-gradient-to-tr from-primary to-accent opacity-20 animate-pulse pointer-events-none" />
          
          {/* Center Main Product Image */}
          <div className="relative z-10 w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] rounded-full overflow-hidden border-[6px] border-white dark:border-darkCard shadow-premium-hover transform hover:rotate-12 transition-all duration-700 animate-float-1 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop"
              alt="Premium Millet Kichdi and Spices"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Floating Card 1: Dosa Nutrition */}
          <div className="absolute top-4 sm:top-10 -right-2 sm:-right-8 z-20 glass-card px-4 py-2.5 rounded-2xl shadow-premium animate-float-2 max-w-[150px] sm:max-w-[180px]">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-success/20 text-success">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-extrabold text-textDark dark:text-cream uppercase tracking-wider">Finger Millet Dosa</p>
                <p className="text-[9px] sm:text-[10px] text-textLight dark:text-cream/60">14g Protein • Low GI</p>
              </div>
            </div>
          </div>

          {/* Floating Card 2: Immunity Booster */}
          <div className="absolute bottom-6 sm:bottom-12 -left-4 sm:-left-12 z-20 glass-card px-4 py-2.5 rounded-2xl shadow-premium animate-float-3 max-w-[150px] sm:max-w-[180px]">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-highlight/20 text-highlight">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-extrabold text-textDark dark:text-cream uppercase tracking-wider">Immunity Power</p>
                <p className="text-[9px] sm:text-[10px] text-textLight dark:text-cream/60">Amla + Moringa Boost</p>
              </div>
            </div>
          </div>

          {/* Floating Card 3: Gym Special */}
          <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 z-20 glass-card px-3.5 py-2.5 rounded-2xl shadow-premium animate-float-1 max-w-[130px] sm:max-w-[150px]">
            <span className="text-[9px] sm:text-[10px] font-bold bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light px-2 py-0.5 rounded-full block text-center mb-1">
              GYM SPECIAL
            </span>
            <p className="text-[10px] sm:text-xs font-bold text-center text-textDark dark:text-cream">Millet Noodles</p>
            <p className="text-[9px] sm:text-[10px] text-center text-textLight dark:text-cream/50">100% Air-Dried</p>
          </div>
        </div>
      </div>
    </div>
  );
}
