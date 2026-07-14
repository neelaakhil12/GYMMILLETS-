import React, { useState } from 'react';
import { Star, Heart, Plus, Minus, Eye, ShoppingCart } from 'lucide-react';

export default function ProductCard({
  product,
  onAddToCart,
  onRemoveFromCart,
  cartItem,
  onToggleWishlist,
  isWishlisted,
  onQuickView
}) {
  const isComplexVariant = product.variants && product.variants.length > 0 && typeof product.variants[0] === 'object';

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 && isComplexVariant ? product.variants[0] : null
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddToCart(product, isComplexVariant && selectedVariant ? selectedVariant.label : selectedVariant);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    onAddToCart(product, isComplexVariant && selectedVariant ? selectedVariant.label : selectedVariant);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    onRemoveFromCart(product, isComplexVariant && selectedVariant ? selectedVariant.label : selectedVariant);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    onQuickView(product);
  };

  const currentPrice = isComplexVariant && selectedVariant ? selectedVariant.price : product.price;
  const currentQty = isComplexVariant && selectedVariant ? selectedVariant.label : product.quantity;

  return (
    <div
      className="group relative rounded-3xl bg-white dark:bg-darkCard border border-accent/15 dark:border-accent/5 overflow-hidden transition-all duration-300 hover:shadow-premium-hover scale-100 hover:scale-[1.01] flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-aos="fade-up"
    >
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white dark:bg-darkCard">

        {/* Wishlist Button Overlay */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/80 dark:bg-darkCard/80 backdrop-blur-sm border border-accent/10 hover:border-highlight text-textDark dark:text-cream transition-all scale-100 hover:scale-110 active:scale-90"
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isWishlisted ? 'fill-highlight text-highlight' : 'text-textLight dark:text-cream/70'
            }`}
          />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-1 transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleQuickViewClick}
            className="p-3 rounded-full bg-white text-primary hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-premium flex items-center justify-center font-semibold text-xs gap-1.5"
          >
            <Eye size={16} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3">
        {/* Rating and Category */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-textLight dark:text-cream/50 bg-cream dark:bg-[#252525] px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          <div className="flex items-center gap-1 bg-success/10 text-success dark:bg-success/20 dark:text-success-light px-2 py-0.5 rounded-lg text-xs font-bold">
            <Star size={12} className="fill-success" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Product Name */}
        <div>
          <h3
            className="font-outfit font-extrabold text-base sm:text-lg text-textDark dark:text-cream hover:text-primary dark:hover:text-success-light cursor-pointer transition-colors line-clamp-1"
            onClick={handleQuickViewClick}
          >
            {product.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-textLight dark:text-cream/60 mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Variant Selection if variants exist (Only render dynamic Quantity/Size select options) */}
        {product.variants && product.variants.length > 0 && isComplexVariant && (
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wide text-textLight dark:text-cream/40 block">
              Choose Quantity / Size:
            </label>
            <select
              value={selectedVariant?.label || ''}
              onChange={(e) => {
                const val = e.target.value;
                const found = product.variants.find(v => v.label === val);
                setSelectedVariant(found || null);
              }}
              className="w-full text-xs font-medium bg-cream/70 dark:bg-darkCard border border-accent/20 dark:border-accent/5 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-primary text-textDark dark:text-cream"
            >
              {product.variants.map((v) => {
                const label = v.label;
                return (
                  <option key={label} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* Pricing and Dynamic Swiggy Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-accent/5 mt-2">
          {/* Price & Weight */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-outfit font-black text-textDark dark:text-cream">₹{currentPrice || 80}</span>
              <span className="text-xs text-textLight dark:text-cream/50">/ {currentQty || '100g'}</span>
            </div>
            {currentPrice && currentPrice > 100 && (
              <span className="text-[9px] font-bold text-success">
                Save 15% Today
              </span>
            )}
          </div>

          {/* Swiggy Style ADD button */}
          <div className="min-w-[85px] h-[34px] relative">
            {cartItem && cartItem.quantity > 0 ? (
              // Swiggy style quantity selector
              <div className="w-full h-full flex items-center justify-between bg-primary dark:bg-success text-cream rounded-full px-2 shadow-premium font-bold text-sm transition-all duration-300">
                <button
                  onClick={handleDecrement}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors active:scale-75"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs select-none w-4 text-center">{cartItem.quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors active:scale-75"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              // Beautiful clean ADD button
              <button
                onClick={handleAddClick}
                className="w-full h-full flex items-center justify-center gap-1 border border-primary dark:border-success text-primary dark:text-success hover:bg-primary hover:text-cream dark:hover:bg-success dark:hover:text-cream bg-white/70 dark:bg-darkCard/50 rounded-full font-extrabold text-xs tracking-wider transition-all scale-100 active:scale-95 shadow-premium hover:shadow-premium-hover"
              >
                <Plus size={12} className="stroke-[3]" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
