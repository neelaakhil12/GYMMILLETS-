import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({
  cartCount,
  wishlistCount,
  activeView,
  setActiveView,
  darkMode,
  setDarkMode,
  onOpenCart,
  openLoginModal,
  currentUser,
  logout
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Monitor scroll to make navbar opaque when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'Best Sellers', view: 'bestsellers' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view) => {
    setMobileMenuOpen(false);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled || mobileMenuOpen
          ? 'bg-cream dark:bg-cream-dark border-b border-accent/10 shadow-premium py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[7.5rem] sm:min-h-[8.5rem] py-2">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <img src="/logo.png" alt="Gym Millets" className="h-28 sm:h-32 w-auto object-contain hover:scale-105 transition-transform duration-300 rounded-full shadow-premium" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view)}
                className={`px-3.5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeView === link.view
                    ? 'bg-primary text-cream shadow-premium'
                    : 'text-textDark hover:bg-primary/10 dark:text-cream/90 dark:hover:bg-cream/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Utility Icons */}
          <div className="hidden md:flex items-center space-x-3.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full text-textDark hover:bg-primary/10 dark:text-cream/90 dark:hover:bg-cream/10 transition-colors duration-300"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} className="text-accent" /> : <Moon size={20} className="text-secondary" />}
            </button>


            {/* Wishlist */}
            <button
              onClick={() => setActiveView('wishlist')}
              className="p-2.5 rounded-full text-textDark hover:bg-primary/10 dark:text-cream/90 dark:hover:bg-cream/10 transition-colors duration-300 relative"
            >
              <Heart size={20} className={wishlistCount > 0 ? 'fill-highlight text-highlight' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-highlight text-cream text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-darkBackground animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2.5 rounded-full text-textDark hover:bg-primary/10 dark:text-cream/90 dark:hover:bg-cream/10 transition-colors duration-300 relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary dark:bg-success text-cream text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-darkBackground">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-cream/10 text-textDark dark:text-cream transition-all duration-300 border border-primary/20 hover:border-primary/40"
                  >
                    <User size={16} className="text-primary dark:text-success-light" />
                    <span className="text-xs font-medium max-w-[80px] truncate">{currentUser.name}</span>
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-48 rounded-2xl bg-white dark:bg-darkCard border border-accent/20 shadow-premium p-1.5 z-50">
                      <div className="px-3.5 py-2.5 border-b border-cream/50 dark:border-cream/5">
                        <p className="text-xs text-textLight dark:text-cream/50">Logged in as</p>
                        <p className="text-sm font-semibold truncate text-textDark dark:text-cream">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveView('order-tracking');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-sm text-textDark dark:text-cream hover:bg-primary/10 rounded-xl transition-all"
                      >
                        Track Orders
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-sm text-highlight dark:text-highlight hover:bg-highlight/10 rounded-xl transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-primary text-cream hover:bg-primary-dark transition-all duration-300 shadow-premium font-medium text-sm"
                >
                  <User size={16} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-1.5">
            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-textDark hover:bg-primary/10 dark:text-cream/90 dark:hover:bg-cream/10 transition-colors"
            >
              {darkMode ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-secondary" />}
            </button>

            {/* Mobile Cart */}
            <button
              onClick={onOpenCart}
              className="p-2 rounded-full text-textDark hover:bg-primary/10 dark:text-cream/90 dark:hover:bg-cream/10 transition-colors relative"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary dark:bg-success text-cream text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-darkBackground">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-textDark hover:bg-primary/10 dark:text-cream/90 dark:hover:bg-cream/10 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream dark:bg-cream-dark shadow-premium border-b border-accent/20 px-4 pt-2 pb-6 space-y-2 mt-2 max-h-[85vh] overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.view)}
              className={`block w-full text-left px-4 py-2.5 rounded-2xl font-medium text-base transition-colors ${
                activeView === link.view
                  ? 'bg-primary text-cream'
                  : 'text-textDark hover:bg-primary/10 dark:text-cream/90'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="border-t border-accent/10 my-3 pt-3 flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('wishlist')}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-textDark hover:bg-primary/10 dark:text-cream/90 text-left font-medium"
            >
              <Heart size={18} className={wishlistCount > 0 ? 'fill-highlight text-highlight' : ''} />
              <span>Wishlist ({wishlistCount})</span>
            </button>

            {currentUser ? (
              <>
                <button
                  onClick={() => handleNavClick('order-tracking')}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-textDark hover:bg-primary/10 dark:text-cream/90 text-left font-medium"
                >
                  <ShoppingCart size={18} />
                  <span>Track Orders</span>
                </button>
                <div className="px-4 py-2 flex items-center justify-between border-t border-accent/5 mt-1">
                  <span className="text-xs text-textLight dark:text-cream/50 truncate max-w-[150px]">
                    Logged in as <strong className="text-textDark dark:text-cream">{currentUser.name}</strong>
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-semibold text-highlight hover:underline"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="w-full py-3 rounded-2xl bg-primary text-cream text-center font-semibold text-sm shadow-premium flex items-center justify-center gap-2"
              >
                <User size={16} />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
