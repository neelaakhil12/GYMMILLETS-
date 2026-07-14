import React, { useState } from 'react';
import { X, Star, Heart, ShoppingCart, Plus, Minus, Shield } from 'lucide-react';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  cartItem,
  onToggleWishlist,
  isWishlisted
}) {
  const isComplexVariant = product.variants && product.variants.length > 0 && typeof product.variants[0] === 'object';

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 && isComplexVariant ? product.variants[0] : null
  );

  const currentPrice = isComplexVariant && selectedVariant ? selectedVariant.price : product.price;
  const currentQty = isComplexVariant && selectedVariant ? selectedVariant.label : product.quantity;

  if (!product) return null;

  const handleAddClick = () => {
    onAddToCart(product, isComplexVariant && selectedVariant ? selectedVariant.label : selectedVariant);
  };

  const handleIncrement = () => {
    onAddToCart(product, isComplexVariant && selectedVariant ? selectedVariant.label : selectedVariant);
  };

  const handleDecrement = () => {
    onRemoveFromCart(product, isComplexVariant && selectedVariant ? selectedVariant.label : selectedVariant);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark Overlay with Blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-darkCard border border-accent/25 dark:border-accent/10 shadow-premium overflow-hidden z-10 transition-all duration-300 flex flex-col md:flex-row max-h-[90vh] md:max-h-none">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-cream/90 hover:bg-cream dark:bg-darkCard/90 dark:hover:bg-darkCard text-textDark dark:text-cream border border-accent/10 transition-all"
        >
          <X size={20} />
        </button>

        {/* Left Side: Product Image & Badges */}
        <div className="w-full md:w-1/2 relative bg-white dark:bg-darkCard p-6 flex items-center justify-center md:border-r border-accent/10">
          {product.badge && (
            <span className="absolute top-4 left-4 z-10 text-[10px] font-extrabold uppercase tracking-widest bg-highlight text-cream px-3.5 py-1.5 rounded-full shadow-premium">
              {product.badge}
            </span>
          )}

          <div className="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-premium bg-white dark:bg-darkCard">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-2 transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Right Side: Product Details & Controls */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
          <div className="space-y-4">
            {/* Category & Ratings */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-textLight dark:text-cream/50 bg-cream dark:bg-[#252525] px-3 py-1 rounded-md">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 bg-success/10 text-success dark:bg-success/20 dark:text-success-light px-3 py-1 rounded-lg text-sm font-bold">
                <Star size={14} className="fill-success" />
                <span>{product.rating}</span>
                <span className="text-xs text-textLight dark:text-cream/50 font-normal">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-outfit font-black text-textDark dark:text-cream">
                {product.name}
              </h2>
              {selectedVariant && isComplexVariant && (
                <p className="text-sm font-semibold text-primary dark:text-success-light mt-1">
                  Selected Variant: <span className="underline">{selectedVariant.label}</span>
                </p>
              )}
            </div>

            {/* Price & Quantity */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-outfit font-black text-textDark dark:text-cream">₹{currentPrice || 80}</span>
              <span className="text-sm text-textLight dark:text-cream/50">/ {currentQty || '100g'}</span>
              <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded ml-2 font-bold">In Stock</span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-textLight dark:text-cream/40 mb-1.5">
                Product Description
              </h4>
              <p className="text-sm text-textLight dark:text-cream/70 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Nutrition Facts Table */}
            {product.nutrition && (
              <div className="border border-accent/20 dark:border-accent/5 rounded-2xl p-4 bg-cream/30 dark:bg-cream-dark/5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-primary dark:text-success-light mb-2 flex items-center gap-1">
                  <Shield size={14} />
                  <span>Nutrition Facts (per 100g)</span>
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white dark:bg-darkCard p-2 rounded-xl border border-accent/5">
                    <p className="text-[10px] text-textLight dark:text-cream/40 font-bold">PROTEIN</p>
                    <p className="text-sm font-extrabold text-textDark dark:text-cream mt-0.5">{product.nutrition.protein}</p>
                  </div>
                  <div className="bg-white dark:bg-darkCard p-2 rounded-xl border border-accent/5">
                    <p className="text-[10px] text-textLight dark:text-cream/40 font-bold">FIBER</p>
                    <p className="text-sm font-extrabold text-textDark dark:text-cream mt-0.5">{product.nutrition.fiber}</p>
                  </div>
                  <div className="bg-white dark:bg-darkCard p-2 rounded-xl border border-accent/5">
                    <p className="text-[10px] text-textLight dark:text-cream/40 font-bold">CARBS</p>
                    <p className="text-sm font-extrabold text-textDark dark:text-cream mt-0.5">{product.nutrition.carbs}</p>
                  </div>
                  <div className="bg-white dark:bg-darkCard p-2 rounded-xl border border-accent/5">
                    <p className="text-[10px] text-textLight dark:text-cream/40 font-bold">FAT</p>
                    <p className="text-sm font-extrabold text-textDark dark:text-cream mt-0.5">{product.nutrition.fat}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Variant Dropdown if variants exist (Only render dynamic Quantity/Size selectors) */}
            {product.variants && product.variants.length > 0 && isComplexVariant && (
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 block">
                  Choose Quantity / Size:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.variants.map((variant) => {
                    const label = variant.label;
                    const isSelected = selectedVariant?.label === label;
                    return (
                      <button
                        key={label}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-primary text-cream border-primary shadow-premium'
                            : 'bg-cream/40 dark:bg-darkCard border-accent/20 dark:border-accent/5 text-textDark dark:text-cream hover:bg-primary/10'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-6 border-t border-accent/10 mt-6">
            {/* Swiggy Style ADD button inside modal */}
            <div className="flex-grow max-w-[200px]">
              {cartItem && cartItem.quantity > 0 ? (
                <div className="flex items-center justify-between bg-primary dark:bg-success text-cream rounded-full px-4 py-2.5 shadow-premium font-bold text-sm">
                  <button
                    onClick={handleDecrement}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors active:scale-75"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm select-none font-extrabold">{cartItem.quantity} in Cart</span>
                  <button
                    onClick={handleIncrement}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors active:scale-75"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddClick}
                  className="w-full flex items-center justify-center gap-2 bg-primary dark:bg-success hover:bg-primary-dark dark:hover:bg-success-dark text-cream rounded-full py-3 font-bold text-sm shadow-premium transition-all scale-100 active:scale-95 hover:shadow-premium-hover"
                >
                  <ShoppingCart size={18} />
                  <span>ADD TO CART</span>
                </button>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => onToggleWishlist(product)}
              className="flex items-center justify-center gap-1.5 px-4.5 py-3 rounded-full border border-accent/25 text-textDark dark:border-accent/10 dark:text-cream hover:bg-highlight/10 hover:text-highlight hover:border-highlight transition-all"
            >
              <Heart size={18} className={isWishlisted ? 'fill-highlight text-highlight' : ''} />
              <span className="text-xs font-bold uppercase tracking-wider">{isWishlisted ? 'Wishlisted' : 'Add Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
