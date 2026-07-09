import React, { useState, useEffect } from 'react';
import AOS from 'aos';

// Importing Data & Sub-components
import { PRODUCTS, TESTIMONIALS, WHY_CHOOSE_US, COUPONS } from './data/products';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';

import CheckoutView from './components/CheckoutView';
import OrderTrackingView from './components/OrderTrackingView';
import AdminPanel from './components/AdminPanel';
import AiRecommendations from './components/AiRecommendations';
import Testimonials from './components/Testimonials';
import WhyChooseUs from './components/WhyChooseUs';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AnimatedCounter from './components/AnimatedCounter';

// Importing Icons for UI
import {
  Search, Heart, ShoppingBag, ArrowRight, Settings, Filter,
  Phone, Shield, User, KeyRound, ShoppingCart, Sun, Moon,
  MapPin, Mail, CookingPot, Soup, Flame, Zap, Sparkles,
  Target, Eye, Compass, Users, Award
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Ready Mix',
    image: '/cat-ready-mix.png',
    filter: 'Ready Mix',
    glowClass: 'bg-primary',
    count: PRODUCTS.filter(p => p.category === 'Ready Mix').length
  },
  {
    name: 'Freeze Dried Powders',
    image: '/cat-powders.png',
    filter: 'Freeze Dried Powders',
    glowClass: 'bg-secondary',
    count: PRODUCTS.filter(p => p.category === 'Freeze Dried Powders').length
  },
  {
    name: 'Premix',
    image: '/cat-premix.png',
    filter: 'Ready Mix',
    glowClass: 'bg-primary',
    count: PRODUCTS.filter(p => p.category === 'Ready Mix').length
  },
  {
    name: 'Instant Mix',
    image: '/cat-instant-mix.png',
    filter: 'Instant Mix',
    glowClass: 'bg-highlight',
    count: PRODUCTS.filter(p => p.category === 'Instant Mix').length
  },
  {
    name: 'Noodles',
    image: '/cat-noodles.png',
    filter: 'Noodles',
    glowClass: 'bg-success',
    count: PRODUCTS.filter(p => p.category === 'Noodles').length
  },
  {
    name: 'Soups',
    image: '/cat-soups.png',
    filter: 'Soups',
    glowClass: 'bg-accent',
    count: PRODUCTS.filter(p => p.category === 'Soups').length
  },
  {
    name: 'Hot Meals',
    image: '/cat-hot-meals.png',
    filter: 'Hot Meal',
    glowClass: 'bg-primary',
    count: PRODUCTS.filter(p => p.category === 'Hot Meal').length
  }
];

export default function App() {
  // --- STATE ---
  const [products, setProducts] = useState(PRODUCTS);
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeView, setActiveView] = useState('home'); // home | shop | wishlist | order-tracking | admin | checkout
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Modals & Popups
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(false);

  // Simulated Authentication State
  const [currentUser, setCurrentUser] = useState({
    name: 'Trainer Akhil',
    email: 'akhil@gymmillets.com',
    mobile: '9876543210'
  });
  
  // Login Form State
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '' });
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Mock Active Orders
  const [orders, setOrders] = useState([
    {
      id: "GM-9921",
      items: [
        { id: "rm-kichdi", name: "Kichdi Premix", variant: "Pearl Millet", price: 240, quantity: 1, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop" }
      ],
      shippingDetails: { name: "Coach Akhil", mobile: "9876543210", address: "Fit House Gym, MG Road", city: "Bangalore", pincode: "560001" },
      paymentDetails: { method: "Card Paid" },
      total: 292,
      status: "Delivered"
    }
  ]);
  const [activeOrder, setActiveOrder] = useState(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Initialize AOS Animations
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic'
    });

    // Recover dark mode preferences or defaults
    const localDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(localDark);
  }, []);

  // Class Toggle for Tailwind Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Simulate skeleton loadings on filter change for high premium responsiveness
  useEffect(() => {
    setSkeletonLoading(true);
    const timer = setTimeout(() => {
      setSkeletonLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  // Simulated Stepper Courier updates in background
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'Delivered') return;

    const timer = setTimeout(() => {
      let nextStatus = '';
      switch (activeOrder.status) {
        case 'Placed': nextStatus = 'Confirmed'; break;
        case 'Confirmed': nextStatus = 'Preparing'; break;
        case 'Preparing': nextStatus = 'Out for Delivery'; break;
        case 'Out for Delivery': nextStatus = 'Delivered'; break;
        default: return;
      }
      
      const updatedOrder = { ...activeOrder, status: nextStatus };
      setActiveOrder(updatedOrder);

      // Also update inside orders log
      setOrders(prev => prev.map(o => o.id === activeOrder.id ? updatedOrder : o));
      addToast(`Order update: Status is now "${nextStatus}"!`, 'info');
    }, 15000); // Progress order state every 15s automatically for demo showcase!

    return () => clearTimeout(timer);
  }, [activeOrder]);

  // --- HANDLERS & HELPERS ---
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAddToCart = (product, variant = null) => {
    const itemKey = `${product.id}-${variant || 'none'}`;
    setCartItems(prev => {
      const existing = prev.find(item => `${item.product.id}-${item.variant || 'none'}` === itemKey);
      if (existing) {
        addToast(`Increased quantity of ${product.name}!`, 'success');
        return prev.map(item =>
          `${item.product.id}-${item.variant || 'none'}` === itemKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        addToast(`Added ${product.name} to your basket!`, 'success');
        return [...prev, { product, variant, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (product, variant = null, forceRemove = false) => {
    const itemKey = `${product.id}-${variant || 'none'}`;
    setCartItems(prev => {
      const existing = prev.find(item => `${item.product.id}-${item.variant || 'none'}` === itemKey);
      if (!existing) return prev;

      if (existing.quantity === 1 || forceRemove) {
        addToast(`Removed ${product.name} from basket.`, 'warning');
        return prev.filter(item => `${item.product.id}-${item.variant || 'none'}` !== itemKey);
      } else {
        return prev.map(item =>
          `${item.product.id}-${item.variant || 'none'}` === itemKey
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const isLiked = prev.some(p => p.id === product.id);
      if (isLiked) {
        addToast(`Removed ${product.name} from wishlist`, 'warning');
        return prev.filter(p => p.id !== product.id);
      } else {
        addToast(`Added ${product.name} to wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      addToast('Please enter credentials.', 'warning');
      return;
    }

    if (isRegisterMode) {
      const newUser = {
        name: loginForm.name || 'Natural Guest',
        email: loginForm.email,
        mobile: '9988776655'
      };
      setCurrentUser(newUser);
      addToast('Registered & Logged in successfully!', 'success');
    } else {
      const activeUser = {
        name: loginForm.email.split('@')[0],
        email: loginForm.email,
        mobile: '9876543210'
      };
      setCurrentUser(activeUser);
      addToast('Welcome back, logged in successfully!', 'success');
    }
    
    setIsLoginModalOpen(false);
    setLoginForm({ email: '', password: '', name: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    addToast('Logged out successfully.', 'info');
  };

  // Place Order handler
  const handlePlaceOrder = (orderDetails) => {
    const finalOrder = {
      ...orderDetails,
      id: `GM-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Placed'
    };

    setOrders(prev => [finalOrder, ...prev]);
    setActiveOrder(finalOrder);
    setCartItems([]);
    setAppliedCoupon(null);
    setActiveView('order-tracking');
    addToast('Order Placed! Check real-time tracking.', 'success');
  };

  // Category & Product Filters
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const bestSellers = products.filter(p => p.badge === 'Best Seller' || p.badge === 'Top Rated');

  // Mobile Bottom Cart Pricing Recap
  const totalCartPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] flex flex-col font-sans transition-colors duration-300">
      
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onRemoveToast={removeToast} />

      {/* Navbar Integration */}
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        activeView={activeView}
        setActiveView={setActiveView}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenCart={() => { setActiveView('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        openLoginModal={() => setIsLoginModalOpen(true)}
        currentUser={currentUser}
        logout={handleLogout}
      />

      {/* MAIN CONTENT VIEW SWITCHER */}
      <main className="flex-grow">
        
        {/* VIEW 1: HOME PAGE */}
        {activeView === 'home' && (
          <div className="space-y-0">
            <Hero setSearchQuery={setSearchQuery} setActiveView={setActiveView} />
            
            {/* Shop By Category Section */}
            <section className="py-16 bg-cream/30 dark:bg-cream-dark/5 border-b border-accent/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading format from user screenshot */}
                <div className="flex justify-between items-center mb-8" data-aos="fade-up">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-primary dark:bg-success rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-outfit font-black text-textDark dark:text-cream">
                      Shop by Category
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setActiveView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-primary hover:text-primary-dark dark:text-success-light dark:hover:text-success font-bold text-sm sm:text-base flex items-center gap-1 transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {CATEGORIES.map((cat, idx) => {
                    return (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.filter);
                          setActiveView('shop');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="group flex flex-col justify-between bg-white dark:bg-darkCard rounded-2xl border border-accent/15 dark:border-accent/5 overflow-hidden transition-all duration-300 hover:border-primary dark:hover:border-success hover:shadow-premium-hover scale-100 hover:scale-[1.02] active:scale-95 text-left"
                        data-aos="fade-up"
                        data-aos-delay={idx * 50}
                      >
                        {/* Rectangular Image wrapper on top */}
                        <div className="aspect-[4/3] w-full overflow-hidden relative">
                          <img 
                            src={cat.image} 
                            alt={cat.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>

                        {/* Centered Category Title Area */}
                        <div className="w-full py-4 text-center bg-white dark:bg-darkCard border-t border-accent/10 dark:border-accent/5">
                          <span className="font-outfit font-bold text-sm sm:text-base text-textDark dark:text-cream group-hover:text-primary dark:group-hover:text-success-light transition-colors block">
                            {cat.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Quick Stats Section */}
            <section className="py-12 bg-cream/10 dark:bg-cream-dark/5 border-b border-accent/10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" data-aos="fade-up">
                  {/* Stat 1 */}
                  <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:bg-success/20 dark:text-success-light flex items-center justify-center">
                      <Users size={22} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-outfit font-black text-textDark dark:text-cream">
                        <AnimatedCounter target={25} suffix=" Million+" />
                      </h3>
                      <p className="text-xs text-textLight dark:text-cream/50 mt-1 font-bold uppercase tracking-wider">
                        Happy Customers
                      </p>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-accent-light flex items-center justify-center">
                      <Zap size={22} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-outfit font-black text-textDark dark:text-cream">
                        <AnimatedCounter target={100} suffix="% Natural" />
                      </h3>
                      <p className="text-xs text-textLight dark:text-cream/50 mt-1 font-bold uppercase tracking-wider">
                        Pesticide-Free Grains
                      </p>
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-highlight/10 text-highlight dark:bg-[#D9987D]/20 dark:text-[#D9987D] flex items-center justify-center">
                      <Award size={22} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-outfit font-black text-textDark dark:text-cream">
                        <AnimatedCounter target={100} suffix="% Quality" />
                      </h3>
                      <p className="text-xs text-textLight dark:text-cream/50 mt-1 font-bold uppercase tracking-wider">
                        Handcrafted Standards
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Sellers Section */}
            <section id="bestsellers" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
              <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
                <span className="text-xs uppercase tracking-widest font-extrabold text-primary dark:text-success-light bg-primary/10 px-3.5 py-1.5 rounded-full">
                  Crowd Favourites
                </span>
                <h2 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream mt-3">
                  Our Best Selling Millets
                </h2>
                <p className="text-sm text-textLight dark:text-cream/50 mt-2 font-semibold">
                  Delicious, high-protein, natural recipes backed by fitness coaches.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.slice(0, 4).map((p) => {
                  const itemInCart = cartItems.find(item => item.product.id === p.id);
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      cartItem={itemInCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some(item => item.id === p.id)}
                      onQuickView={setQuickViewProduct}
                    />
                  );
                })}
              </div>

              <div className="text-center mt-12" data-aos="fade-up">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setActiveView('shop');
                  }}
                  className="px-8 py-3.5 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold transition-all shadow-premium flex items-center justify-center gap-2 mx-auto scale-100 hover:scale-[1.02] active:scale-95 text-sm"
                >
                  <span>Explore Full Natural Menu</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>

            <WhyChooseUs />

            {/* Curated Preview Sections for Standalone Pages */}
            
            {/* 1. Shop Catalog Preview Section */}
            <section id="shop-preview" className="py-20 bg-cream/10 dark:bg-cream-dark/5 scroll-mt-20 border-t border-accent/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-secondary dark:text-accent-light bg-secondary/10 px-3.5 py-1.5 rounded-full">
                    Store Catalog Preview
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream mt-3">
                    Explore Our Natural Shop
                  </h2>
                  <p className="text-sm text-textLight dark:text-cream/50 mt-2 font-semibold font-sans">
                    Nutrient-dense pre-mixes, natural spice powders, and healthy lifestyle noodles.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up">
                  {products.slice(0, 8).map((p) => {
                    const itemInCart = cartItems.find(item => item.product.id === p.id);
                    return (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        cartItem={itemInCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.some(item => item.id === p.id)}
                        onQuickView={setQuickViewProduct}
                      />
                    );
                  })}
                </div>

                <div className="text-center mt-12" data-aos="fade-up">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setActiveView('shop');
                      setTimeout(() => {
                        const el = document.getElementById('shop-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="px-8 py-3.5 rounded-full bg-secondary hover:bg-secondary-dark text-cream font-bold transition-all shadow-premium flex items-center justify-center gap-2 mx-auto scale-100 hover:scale-[1.02] active:scale-95 text-sm"
                  >
                    <span>View Full Shop (Categories & Filters)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </section>



            {/* 3. Active Order Tracking Preview Section */}
            {activeOrder && (
              <section id="order-preview" className="py-20 bg-cream/10 dark:bg-cream-dark/5 scroll-mt-20 border-t border-accent/5">
                <div className="max-w-4xl mx-auto px-4">
                  <div className="text-center mb-10" data-aos="fade-up">
                    <span className="text-xs uppercase tracking-widest font-extrabold text-success dark:text-success-light bg-success/10 px-3.5 py-1.5 rounded-full">
                      Live Dispatch Updates
                    </span>
                    <h2 className="text-3xl font-outfit font-black text-textDark dark:text-cream mt-3">
                      Your Active Order: {activeOrder.id}
                    </h2>
                  </div>

                  <div className="bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 rounded-3xl p-6 sm:p-8 shadow-premium" data-aos="fade-up">
                    <div className="flex justify-between items-center border-b border-accent/5 pb-4 mb-6">
                      <div>
                        <p className="text-[10px] text-textLight dark:text-cream/50 uppercase tracking-widest font-black">Estimated Delivery</p>
                        <p className="text-sm font-bold text-textDark dark:text-cream">Within 45 Minutes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-textLight dark:text-cream/50 uppercase tracking-widest font-black">Current Status</p>
                        <span className="text-xs font-black text-primary bg-primary/10 dark:text-success-light dark:bg-success/20 px-3 py-1 rounded-full uppercase">
                          {activeOrder.status}
                        </span>
                      </div>
                    </div>

                    {/* Simple Stepper */}
                    <div className="grid grid-cols-4 gap-2 relative mb-6">
                      {['Placed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                        const statuses = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
                        const currentIdx = statuses.indexOf(activeOrder.status);
                        const stepIdx = statuses.indexOf(step);
                        const isCompleted = currentIdx >= stepIdx;
                        
                        return (
                          <div key={step} className="flex flex-col items-center relative text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 z-10 transition-all ${
                              isCompleted
                                ? 'bg-primary dark:bg-success text-cream border-primary dark:border-success'
                                : 'bg-cream/55 dark:bg-[#1E1E1E] text-textLight border-accent/20'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[9px] sm:text-xs font-bold mt-2 ${
                              isCompleted ? 'text-textDark dark:text-cream' : 'text-textLight dark:text-cream/40'
                            }`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-center pt-2">
                      <button
                        onClick={() => {
                          setActiveView('order-tracking');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-6 py-2.5 rounded-full bg-primary dark:bg-success hover:bg-primary-dark dark:hover:bg-success-dark text-cream font-bold text-xs shadow-premium flex items-center justify-center gap-1.5 mx-auto scale-100 hover:scale-[1.02] active:scale-95"
                      >
                        <span>Launch Live GPS Tracking Map</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <Testimonials />
          </div>
        )}

        {/* VIEW 2: FULL SHOP PRODUCT GRID */}
        {activeView === 'shop' && (
          <div id="shop-section" className="pt-48 sm:pt-52 lg:pt-56 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
            
            {/* Title & Searching */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-accent/15 pb-6 mb-8 gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light px-3.5 py-1.5 rounded-full">
                  GymMillets Food Market
                </span>
                <h1 className="text-3xl font-outfit font-black text-textDark dark:text-cream mt-2">Natural Millet Store</h1>
              </div>

              {/* Search input in shop page */}
              <div className="relative w-full md:max-w-xs flex items-center">
                <Search size={16} className="absolute left-3.5 text-textLight dark:text-cream/50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter dosa, soup, powder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkCard border border-accent/20 dark:border-accent/5 focus:outline-none focus:border-primary rounded-xl text-xs font-semibold text-textDark dark:text-cream shadow-sm"
                />
              </div>
            </div>

            {/* Category Filter Pills (Swiggy Horizontal Steppers) */}
            <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 -mx-4 px-4 scrollbar-none">
              {['All', ...PRODUCTS.reduce((acc, p) => acc.includes(p.category) ? acc : [...acc, p.category], [])].map((catName) => (
                <button
                  key={catName}
                  onClick={() => setSelectedCategory(catName)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all border shrink-0 scale-100 active:scale-95 shadow-sm ${
                    selectedCategory === catName
                      ? 'bg-primary text-cream border-primary shadow-premium'
                      : 'bg-white dark:bg-darkCard border-accent/20 dark:border-accent/5 text-textDark dark:text-cream hover:bg-primary/10'
                  }`}
                >
                  {catName}
                </button>
              ))}
            </div>

            {/* Products Grid with Skeletons */}
            {skeletonLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-3xl border border-accent/15 dark:border-accent/5 bg-white dark:bg-darkCard overflow-hidden p-5 space-y-4">
                    <div className="aspect-[4/3] w-full rounded-2xl skeleton-shimmer" />
                    <div className="h-4 w-1/3 rounded skeleton-shimmer" />
                    <div className="h-6 w-3/4 rounded skeleton-shimmer" />
                    <div className="h-10 w-full rounded-xl skeleton-shimmer pt-2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 p-8 space-y-4">
                <span className="text-4xl block">🔍</span>
                <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream">No Natural Grains Match</h3>
                <p className="text-xs text-textLight dark:text-cream/50 max-w-sm mx-auto font-medium">
                  We couldn't find any products matching your active filters. Try resetting search fields or categories!
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-6 py-2.5 rounded-full bg-primary text-cream font-bold text-xs shadow-premium"
                >
                  Reset Shop Filters
                </button>
              </div>
            ) : selectedCategory === 'Hot Meal' ? (
              <div className="space-y-12">
                {/* Veg Millet Meals Section */}
                {filteredProducts.filter(p => p.id.startsWith('hm-veg')).length > 0 && (
                  <div className="space-y-6">
                    <div className="border-b border-primary/20 dark:border-success-light/20 pb-3 flex items-center gap-2">
                      <span className="text-2xl">🍲</span>
                      <h3 className="text-xl sm:text-2xl font-outfit font-black text-primary dark:text-success-light">
                        Veg Millet Meal - <span className="text-secondary dark:text-accent-light">₹150</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredProducts.filter(p => p.id.startsWith('hm-veg')).map((p) => {
                        const itemInCart = cartItems.find(item => item.product.id === p.id);
                        return (
                          <ProductCard
                            key={p.id}
                            product={p}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            cartItem={itemInCart}
                            onToggleWishlist={handleToggleWishlist}
                            isWishlisted={wishlist.some(item => item.id === p.id)}
                            onQuickView={setQuickViewProduct}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Non-Veg Millet Meals Section */}
                {filteredProducts.filter(p => p.id.startsWith('hm-nonveg')).length > 0 && (
                  <div className="space-y-6 pt-6">
                    <div className="border-b border-highlight/20 pb-3 flex items-center gap-2">
                      <span className="text-2xl">🍗</span>
                      <h3 className="text-xl sm:text-2xl font-outfit font-black text-highlight">
                        Non-Veg Millet Meal - <span className="text-secondary dark:text-accent-light">₹205</span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredProducts.filter(p => p.id.startsWith('hm-nonveg')).map((p) => {
                        const itemInCart = cartItems.find(item => item.product.id === p.id);
                        return (
                          <ProductCard
                            key={p.id}
                            product={p}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            cartItem={itemInCart}
                            onToggleWishlist={handleToggleWishlist}
                            isWishlisted={wishlist.some(item => item.id === p.id)}
                            onQuickView={setQuickViewProduct}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => {
                  const itemInCart = cartItems.find(item => item.product.id === p.id);
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      cartItem={itemInCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some(item => item.id === p.id)}
                      onQuickView={setQuickViewProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: WISHLIST VIEW */}
        {activeView === 'wishlist' && (
          <div className="pt-48 sm:pt-52 lg:pt-56 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="border-b border-accent/15 pb-6 mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light px-3.5 py-1.5 rounded-full">
                Saved Items
              </span>
              <h1 className="text-3xl font-outfit font-black text-textDark dark:text-cream mt-2">Your Millet Wishlist</h1>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 p-8 space-y-4">
                <span className="text-4xl block">❤️</span>
                <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream">Wishlist is empty</h3>
                <p className="text-xs text-textLight dark:text-cream/50 max-w-sm mx-auto font-medium">
                  Tap the heart icon on any product cards in the shop to bookmark your healthy millet favorites!
                </p>
                <button
                  onClick={() => setActiveView('shop')}
                  className="px-6 py-2.5 rounded-full bg-primary text-cream font-bold text-xs shadow-premium"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((p) => {
                  const itemInCart = cartItems.find(item => item.product.id === p.id);
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      cartItem={itemInCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={true}
                      onQuickView={setQuickViewProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3.5: FULL CART PAGE */}
        {activeView === 'cart' && (
          <div className="pt-48 sm:pt-52 lg:pt-56 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="border-b border-accent/15 pb-6 mb-8 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light px-3.5 py-1.5 rounded-full">
                  Your Basket
                </span>
                <h1 className="text-3xl font-outfit font-black text-textDark dark:text-cream mt-2">
                  Shopping Cart
                  {cartItems.length > 0 && (
                    <span className="ml-3 text-lg text-textLight dark:text-cream/50 font-medium">
                      ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
                    </span>
                  )}
                </h1>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={() => { setCartItems([]); addToast('Cart cleared', 'warning'); }}
                  className="text-xs font-bold text-highlight border border-highlight/40 px-4 py-2 rounded-full hover:bg-highlight/10 transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 p-8 space-y-4">
                <span className="text-5xl block">🛒</span>
                <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream">Your cart is empty</h3>
                <p className="text-xs text-textLight dark:text-cream/50 max-w-sm mx-auto font-medium">
                  Looks like you haven't added any healthy millet meals yet. Start shopping!
                </p>
                <button
                  onClick={() => { setSelectedCategory('All'); setActiveView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-2.5 rounded-full bg-primary text-cream font-bold text-xs shadow-premium"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.product.id}-${item.variant || 'none'}`}
                      className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 shadow-premium"
                    >
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-cream dark:bg-cream-dark/5 flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-outfit font-extrabold text-base text-textDark dark:text-cream leading-tight">{item.product.name}</h4>
                            <p className="text-[10px] text-textLight dark:text-cream/50 mt-0.5 font-bold">{item.product.quantity}</p>
                            {item.variant && (
                              <span className="text-[10px] bg-primary/10 text-primary dark:bg-success/20 dark:text-success-light font-bold px-2 py-0.5 rounded-md mt-1 inline-block">
                                Variant: {item.variant}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.product, item.variant, true)}
                            className="text-textLight hover:text-highlight dark:text-cream/40 transition-colors p-1"
                            title="Remove item"
                          >
                            <span className="text-base">✕</span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-outfit font-black text-base text-textDark dark:text-cream">₹{item.product.price * item.quantity}</span>
                          <div className="flex items-center gap-3 bg-cream dark:bg-cream-dark/10 rounded-full px-3 py-1.5 border border-accent/20 dark:border-accent/5">
                            <button onClick={() => handleRemoveFromCart(item.product, item.variant)} className="text-textLight hover:text-textDark dark:hover:text-cream active:scale-75 transition-transform font-bold text-base leading-none">
                              −
                            </button>
                            <span className="text-sm font-black w-5 text-center select-none text-textDark dark:text-cream">{item.quantity}</span>
                            <button onClick={() => handleAddToCart(item.product, item.variant)} className="text-textLight hover:text-textDark dark:hover:text-cream active:scale-75 transition-transform font-bold text-base leading-none">
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary Panel */}
                <div className="lg:col-span-1">
                  <div className="sticky top-28 bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 rounded-3xl p-6 shadow-premium space-y-4">
                    <h3 className="font-outfit font-black text-lg text-textDark dark:text-cream border-b border-accent/10 pb-3">Order Summary</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-textLight dark:text-cream/60 font-medium">
                        <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                        <span>₹{cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0)}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-success font-semibold">
                          <span>Discount ({appliedCoupon.discount}%)</span>
                          <span>-₹{Math.round(cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0) * appliedCoupon.discount / 100)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-textLight dark:text-cream/60 font-medium">
                        <span>GST (5%)</span>
                        <span>₹{Math.round(cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0) * 0.05)}</span>
                      </div>
                      <div className="flex justify-between text-textLight dark:text-cream/60 font-medium">
                        <span>Shipping</span>
                        <span className={cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0) > 500 ? 'text-success font-bold' : ''}>
                          {cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0) > 500 ? 'Free' : '₹40'}
                        </span>
                      </div>
                      <div className="flex justify-between font-outfit font-black text-base text-textDark dark:text-cream border-t border-accent/10 pt-3 mt-1">
                        <span>Total</span>
                        <span>₹{
                          (() => {
                            const sub = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
                            const disc = appliedCoupon ? Math.round(sub * appliedCoupon.discount / 100) : 0;
                            const ship = sub > 500 ? 0 : 40;
                            const tax = Math.round(sub * 0.05);
                            return sub - disc + ship + tax;
                          })()
                        }</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { setActiveView('checkout'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold text-sm shadow-premium flex items-center justify-center gap-2 scale-100 active:scale-95 transition-all"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => { setSelectedCategory('All'); setActiveView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="w-full py-3 rounded-full border border-accent/20 text-textLight dark:text-cream/60 font-bold text-xs hover:bg-cream dark:hover:bg-darkCard/60 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <AdminPanel
            products={products}
            setProducts={setProducts}
            orders={orders}
            setOrders={setOrders}
            categories={['Ready Mix', 'Instant Mix', 'Freeze Dried Powders', 'Noodles', 'Soups', 'Hot Meal']}
            onAddToast={addToast}
          />
        )}

        {/* VIEW 5: CHECKOUT FLOW */}
        {activeView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            appliedCoupon={appliedCoupon}
            onPlaceOrder={handlePlaceOrder}
            setActiveView={setActiveView}
          />
        )}

        {/* VIEW 6: LIVE ORDER TRACKING */}
        {activeView === 'order-tracking' && (
          <OrderTrackingView
            activeOrder={activeOrder}
            setActiveView={setActiveView}
          />
        )}

        {/* VIEW 8: STANDALONE ABOUT VIEW */}
        {activeView === 'about' && (
          <div className="pt-48 sm:pt-52 lg:pt-56 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light px-3.5 py-1.5 rounded-full">
                  About GymMillets
                </span>
                <h1 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream mt-3">
                  Our Natural Grain Science
                </h1>
                <p className="text-sm text-textLight dark:text-cream/50 mt-2 font-semibold font-sans">
                  Handcrafted with pure nutrition facts to support your fitness and athletic goals.
                </p>
              </div>

              {/* Brand Story block */}
              <div className="bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 rounded-3xl p-8 sm:p-12 shadow-premium" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                  <div className="md:col-span-8">
                    <h3 className="text-2xl font-outfit font-black text-textDark dark:text-cream mb-4">
                      Crafting Pure Grains Since 2018
                    </h3>
                    <p className="text-xs sm:text-sm text-textLight dark:text-cream/70 leading-relaxed font-semibold mb-4 font-sans">
                      At GymMillets, we believe that fitness starts in the kitchen, not just the gym. Traditional millets have been India's superfoods for thousands of years, but modern processing removed their nutrient-dense husks.
                    </p>
                    <p className="text-xs sm:text-sm text-textLight dark:text-cream/70 leading-relaxed font-semibold font-sans">
                      We source 100% natural dryland grains from smallholder farmers, and slow-roast them at precise temperatures. No preservatives, no refined sugar, and zero additives. Just pure, ancient, muscle-building energy.
                    </p>
                  </div>
                  <div className="md:col-span-4 rounded-2xl overflow-hidden shadow-premium h-[250px] sm:h-[300px] w-full max-w-sm justify-self-center">
                    <img 
                      src="/brand-story.png" 
                      alt="Brand Story" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Core Values Section: Vision, Mission, Aim */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Vision Card */}
                <div className="bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 rounded-3xl p-8 shadow-premium flex flex-col justify-between hover:shadow-premium-hover scale-100 hover:scale-[1.02] transition-all duration-300" data-aos="fade-up" data-aos-delay="50">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:bg-success/20 dark:text-success-light flex items-center justify-center">
                      <Eye size={24} />
                    </div>
                    <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream">
                      Our Vision
                    </h3>
                    <p className="text-xs sm:text-sm text-textLight dark:text-cream/70 leading-relaxed font-semibold font-sans">
                      To empower millions of active individuals globally by integrating ancient, nutrient-dense natural superfoods into modern daily fitness regimes, fostering sustainable global wellness.
                    </p>
                  </div>
                </div>

                {/* Mission Card */}
                <div className="bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 rounded-3xl p-8 shadow-premium flex flex-col justify-between hover:shadow-premium-hover scale-100 hover:scale-[1.02] transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-accent-light flex items-center justify-center">
                      <Compass size={24} />
                    </div>
                    <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream">
                      Our Mission
                    </h3>
                    <p className="text-xs sm:text-sm text-textLight dark:text-cream/70 leading-relaxed font-semibold font-sans">
                      Sourcing premium grains ethically from smallholder farmers, conserving local heritage, and crafting clean, high-protein formulations without preservatives or chemical additives.
                    </p>
                  </div>
                </div>

                {/* Aim Card */}
                <div className="bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 rounded-3xl p-8 shadow-premium flex flex-col justify-between hover:shadow-premium-hover scale-100 hover:scale-[1.02] transition-all duration-300" data-aos="fade-up" data-aos-delay="150">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-highlight/10 text-highlight dark:bg-[#D9987D]/20 dark:text-[#D9987D] flex items-center justify-center">
                      <Target size={24} />
                    </div>
                    <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream">
                      Our Aim
                    </h3>
                    <p className="text-xs sm:text-sm text-textLight dark:text-cream/70 leading-relaxed font-semibold font-sans">
                      To make clean, high-performance daily nutrition easy, convenient, and delicious—fueling healthy, active lifestyles with modern, ancestral grain science.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quality Cards Component (Why Choose Us) */}
              <div className="mt-16 border-t border-accent/10 pt-16">
                <WhyChooseUs />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 9: STANDALONE CONTACT VIEW */}
        {activeView === 'contact' && (
          <div className="pt-48 sm:pt-52 lg:pt-56 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light px-3.5 py-1.5 rounded-full">
                Get in Touch
              </span>
              <h1 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream mt-3">
                Contact GymMillets HQ
              </h1>
              <p className="text-sm text-textLight dark:text-cream/50 mt-2 font-semibold font-sans">
                Have questions about our grains or custom bulk orders? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Form card */}
              <div className="lg:col-span-7 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-6 sm:p-8">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    addToast('Thank you! Your message has been sent successfully.', 'success');
                    e.target.reset();
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Coach Akhil"
                        className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. akhil@gymmillets.com"
                        className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">Your Message</label>
                    <textarea
                      required
                      rows="5"
                      placeholder="Type your message here..."
                      className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-cream font-bold py-3.5 rounded-full shadow-premium flex items-center justify-center gap-1 hover:shadow-premium-hover scale-100 active:scale-95 transition-all text-sm"
                  >
                    <span>Send Message</span>
                  </button>
                </form>
              </div>

              {/* Side contact cards & Interactive Map */}
              <div className="lg:col-span-5 space-y-6">
                {/* Info Block */}
                <div className="bg-[#1C1A17] dark:bg-[#0d0d0d] text-cream rounded-3xl p-6 sm:p-8 space-y-6 shadow-premium">
                  <h3 className="text-lg font-outfit font-black text-success-light border-b border-white/10 pb-3">HQ Contact Details</h3>
                  <ul className="space-y-5">
                    <li className="flex gap-3.5">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <MapPin size={16} className="text-success-light" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Physical Store Address</p>
                        <p className="text-xs font-semibold text-cream/80 leading-relaxed">
                          12A, Natural Complex, Indiranagar,<br />Bangalore – 560038, Karnataka, IN
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3.5">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <Phone size={16} className="text-success-light" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Telephone Hotlines</p>
                        <a href="tel:+919876543210" className="text-xs font-semibold text-cream/80 hover:text-white transition-colors block">
                          +91 98765 43210
                        </a>
                      </div>
                    </li>
                    <li className="flex gap-3.5">
                      <div className="p-2 bg-white/10 rounded-xl">
                        <Mail size={16} className="text-success-light" />
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Email Support Desk</p>
                        <a href="mailto:support@gymmillets.com" className="text-xs font-semibold text-cream/80 hover:text-white transition-colors block">
                          support@gymmillets.com
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Simulated Google Map */}
                <div className="rounded-3xl border border-accent/15 dark:border-accent/5 overflow-hidden h-48 relative shadow-premium bg-[#EAEAEA] dark:bg-[#1E1E1E] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="z-10 text-center space-y-2">
                    <span className="text-2xl block animate-bounce">📍</span>
                    <p className="text-xs font-black text-textDark dark:text-cream">GymMillets HQ Indiranagar</p>
                    <p className="text-[10px] text-textLight dark:text-cream/50 font-bold">Bangalore, Karnataka 560038</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <Footer
        setActiveView={setActiveView}
        setSelectedCategory={setSelectedCategory}
        onAddToast={addToast}
      />

      {/* Cart is now a full page view — no modal needed */}

      {/* Quick View Product Details Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          cartItem={cartItems.find(item => item.product.id === quickViewProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some(item => item.id === quickViewProduct.id)}
        />
      )}

      {/* Authentication Login / Register Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white dark:bg-darkCard border border-accent/25 dark:border-accent/5 rounded-3xl shadow-premium overflow-hidden p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-cream/70 hover:bg-cream dark:bg-darkCard dark:hover:bg-darkCard/80 text-textDark dark:text-cream rounded-full border border-accent/15 transition-all"
            >
              🌾
            </button>

            <div className="text-center space-y-1">
              <h3 className="text-2xl font-outfit font-black text-textDark dark:text-cream">
                {isRegisterMode ? 'Register Account' : 'Login Store'}
              </h3>
              <p className="text-xs text-textLight dark:text-cream/50">
                {isRegisterMode ? 'Sign up to purchase natural millet foods.' : 'Welcome back to your natural diet tracker.'}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {isRegisterMode && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-extrabold text-textLight dark:text-cream/40 uppercase">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={loginForm.name}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream font-bold"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-textLight dark:text-cream/40 uppercase">Email Address</label>
                <input
                  type="email"
                  placeholder="coach@gymmillets.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream font-bold"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold text-textLight dark:text-cream/40 uppercase">Security Password</label>
                <input
                  type="password"
                  placeholder="******"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream font-bold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-cream font-bold py-3 rounded-full text-xs shadow-premium flex items-center justify-center gap-1.5 transition-all scale-100 active:scale-95 mt-2"
              >
                <KeyRound size={14} />
                <span>{isRegisterMode ? 'SIGN UP NOW' : 'SECURE LOGIN'}</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs font-bold text-primary dark:text-success-light hover:underline uppercase"
              >
                {isRegisterMode ? 'Already have an account? Login' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Chat Button */}
      <a
        href="https://wa.me/919876543210?text=Hi%20GymMillets!%20I%27d%20love%20to%20order%20some%20healthy%20natural%20millet%20premixes."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-50 group flex items-center gap-2 p-3.5 sm:p-4 rounded-full bg-[#25D366] text-white shadow-premium hover:shadow-premium-hover hover:bg-[#20ba5a] active:scale-95 transition-all duration-300 animate-bounce"
        style={{ animationDuration: '3s' }}
        title="Chat on WhatsApp"
      >
        {/* Pulsing Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:hidden" />
        
        {/* Sleek Tooltip Expand on Hover */}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-xs font-black uppercase tracking-wider text-white">
          Chat on WhatsApp
        </span>

        {/* WhatsApp Icon */}
        <svg viewBox="0 0 24 24" width="24" height="24" className="fill-current relative z-10">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73 0-2.597-1.012-5.04-2.85-6.88A9.73 9.73 0 0 0 12.008 1.24c-5.44 0-9.866 4.372-9.87 9.732-.001 1.69.467 3.334 1.354 4.79l-.997 3.646 3.734-.972zm11.111-6.8c-.29-.145-1.716-.847-1.978-.942-.262-.096-.453-.145-.642.145-.19.29-.738.942-.905 1.134-.167.19-.335.213-.625.068-1.579-.79-2.733-1.36-3.83-3.242-.29-.5-.29-.86-.145-1.005.13-.13.29-.338.435-.507.145-.169.19-.29.29-.483.097-.19.048-.362-.024-.507-.072-.145-.642-1.546-.88-2.124-.23-.556-.465-.48-.642-.486-.164-.006-.353-.007-.542-.007-.19 0-.498.072-.759.362-.262.29-1.002.978-1.002 2.387 0 1.41 1.028 2.77 1.171 2.964.143.195 2.024 3.09 4.901 4.33 1.62.698 2.885 1.113 3.878 1.43.836.265 1.597.228 2.198.138.67-.1 1.717-.7 1.957-1.376.24-.678.24-1.258.17-1.377-.073-.118-.262-.189-.553-.334z" />
        </svg>
      </a>

      {/* Sticky Mobile Bottom Cart Summary (Swiggy Style Overlay on mobile) */}
      {cartItems.length > 0 && activeView !== 'checkout' && activeView !== 'order-tracking' && (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-40 p-4 bg-white/80 dark:bg-darkCard/80 backdrop-blur-md border-t border-accent/20 flex items-center justify-between shadow-premium">
          <div>
            <p className="text-[10px] text-textLight dark:text-cream/50 font-bold uppercase tracking-wider">Active Basket</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-outfit font-black text-textDark dark:text-cream">₹{totalCartPrice}</span>
              <span className="text-[10px] text-textLight dark:text-cream/60">({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
            </div>
          </div>

          <button
            onClick={() => { setActiveView('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-1 bg-primary text-cream font-bold px-6 py-2.5 rounded-full text-xs shadow-premium active:scale-95 transition-all uppercase tracking-wider"
          >
            <span>View Cart</span>
            <ShoppingCart size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
