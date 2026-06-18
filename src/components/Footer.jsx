import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ setActiveView, setSelectedCategory, onAddToast }) {

  const handleCategoryLink = (catName) => {
    setSelectedCategory(catName);
    setActiveView('shop');
    setTimeout(() => {
      const el = document.getElementById('shop-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleViewLink = (view) => {
    setActiveView(view);
    if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnchorLink = (anchor) => {
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <footer id="contact" className="bg-[#1C1A17] text-cream dark:bg-black border-t border-accent/15 pt-16 pb-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-accent/10">

        {/* Column 1: Brand Info */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center cursor-pointer" onClick={() => handleViewLink('home')}>
            <img src="/logo.png" alt="Gym Millets" className="h-28 sm:h-32 w-auto object-contain hover:scale-105 transition-transform duration-300 rounded-full shadow-premium" />
          </div>
          <p className="text-xs sm:text-sm text-cream/60 leading-relaxed font-semibold max-w-sm">
            Premium healthy millet premixes, powders, soups, and noodles. Handcrafted with traditional organic grain science to support your active lifestyle.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 bg-cream/10 hover:bg-success hover:text-cream rounded-full transition-colors text-cream/70" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 bg-cream/10 hover:bg-success hover:text-cream rounded-full transition-colors text-cream/70" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 bg-cream/10 hover:bg-highlight hover:text-cream rounded-full transition-colors text-cream/70" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-success-light">Quick Links</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-cream/60">
            <li>
              <button onClick={() => handleViewLink('home')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200 flex items-center gap-1.5">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => handleViewLink('shop')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Shop
              </button>
            </li>
            <li>
              <button onClick={() => handleViewLink('bestsellers')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Best Sellers
              </button>
            </li>
            <li>
              <button onClick={() => handleViewLink('about')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                About
              </button>
            </li>
            <li>
              <button onClick={() => handleViewLink('contact')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-success-light">Categories</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-cream/60">
            <li>
              <button onClick={() => handleCategoryLink('Ready Mix')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Ready Mixes
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryLink('Instant Mix')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Instant Mixes
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryLink('Powders')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Immunity Powders
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryLink('Noodles')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Millet Noodles
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryLink('Soups')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Millet Soups
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryLink('Hot Meal')} className="hover:text-cream transition-colors text-left hover:translate-x-1 transform duration-200">
                Hot Meals
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info (replaces Newsletter) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-success-light">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-success/20 rounded-xl flex-shrink-0">
                <MapPin size={15} className="text-success-light" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-cream/40 mb-0.5">Address</p>
                <p className="text-xs sm:text-sm font-semibold text-cream/70 leading-relaxed">
                  12A, Organic Complex, Indiranagar,<br />Bangalore – 560038, Karnataka, IN
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-success/20 rounded-xl flex-shrink-0">
                <Phone size={15} className="text-success-light" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-cream/40 mb-0.5">Phone</p>
                <a href="tel:+919876543210" className="text-xs sm:text-sm font-semibold text-cream/70 hover:text-cream transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 p-2 bg-success/20 rounded-xl flex-shrink-0">
                <Mail size={15} className="text-success-light" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-cream/40 mb-0.5">Email</p>
                <a href="mailto:support@gymmillets.com" className="text-xs sm:text-sm font-semibold text-cream/70 hover:text-cream transition-colors">
                  support@gymmillets.com
                </a>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center">
        <div className="text-xs text-cream/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GymMillets. All rights reserved. 🌾 Designed for clean organic health.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-cream transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-cream transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
