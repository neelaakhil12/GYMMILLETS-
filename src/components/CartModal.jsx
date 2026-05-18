import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Percent, Sparkles } from 'lucide-react';
import { COUPONS } from '../data/products';

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
  appliedCoupon,
  setAppliedCoupon
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Apply Coupon Logic
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const foundCoupon = COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());

    if (!foundCoupon) {
      setCouponError('Invalid coupon code. Try FIRSTFIT or GYMPOWER30!');
      return;
    }

    if (subtotal < foundCoupon.minPurchase) {
      setCouponError(`Min purchase of ₹${foundCoupon.minPurchase} required for this coupon.`);
      return;
    }

    setAppliedCoupon(foundCoupon);
    setCouponSuccess(`Coupon applied successfully! You saved ${foundCoupon.discount}%!`);
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shippingFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal - discountAmount + shippingFee + taxAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-500 ease-in-out glassmorphism border-l border-accent/20 dark:border-accent/15 flex flex-col justify-between h-full shadow-premium">
          
          {/* Header */}
          <div className="p-6 border-b border-accent/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-outfit font-black text-textDark dark:text-cream">Your Basket</span>
              <span className="bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light text-xs font-black px-2.5 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-cream dark:hover:bg-[#252525] text-textDark dark:text-cream transition-colors border border-accent/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-cream/70 dark:bg-darkCard flex items-center justify-center text-3xl animate-bounce">
                  🛒
                </div>
                <div>
                  <h3 className="text-lg font-outfit font-extrabold text-textDark dark:text-cream">Your cart is empty</h3>
                  <p className="text-xs text-textLight dark:text-cream/50 mt-1 max-w-[250px] mx-auto font-medium">
                    Looks like you haven't added any healthy millet meals yet. Start shopping!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold text-xs shadow-premium transition-all"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.variant || 'none'}`}
                    className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 shadow-premium group relative"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream dark:bg-cream-dark/5 flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-outfit font-extrabold text-sm text-textDark dark:text-cream leading-tight">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromCart(item.product, item.variant, true)}
                            className="text-textLight hover:text-highlight dark:text-cream/40 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {item.variant && (
                          <span className="text-[10px] bg-primary/10 text-primary dark:bg-success/20 dark:text-success-light font-bold px-2 py-0.5 rounded-md mt-1 inline-block">
                            Variant: {item.variant}
                          </span>
                        )}
                        <p className="text-[10px] text-textLight dark:text-cream/50 mt-0.5 font-bold">Qty: {item.product.quantity}</p>
                      </div>

                      {/* Pricing and Counters */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-outfit font-black text-sm text-textDark dark:text-cream">
                          ₹{item.product.price * item.quantity}
                        </span>
                        
                        {/* +/- selectors */}
                        <div className="flex items-center gap-2 bg-cream dark:bg-cream-dark/10 rounded-full px-2 py-1 border border-accent/20 dark:border-accent/5">
                          <button
                            onClick={() => onRemoveFromCart(item.product, item.variant)}
                            className="p-0.5 text-textLight hover:text-textDark dark:hover:text-cream active:scale-75 transition-transform"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold w-4 text-center select-none">{item.quantity}</span>
                          <button
                            onClick={() => onAddToCart(item.product, item.variant)}
                            className="p-0.5 text-textLight hover:text-textDark dark:hover:text-cream active:scale-75 transition-transform"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Calculations and Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white dark:bg-darkCard border-t border-accent/15 space-y-4">
              
              {/* Coupon Form */}
              <div className="border-b border-accent/10 pb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-success/10 border border-success/30 rounded-xl px-3 py-2 text-success">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="animate-spin" />
                      <div>
                        <p className="text-xs font-extrabold">{appliedCoupon.code} Applied</p>
                        <p className="text-[10px] text-success/80">Saved {appliedCoupon.discount}% off subtotal</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-highlight hover:underline uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-cream/70 dark:bg-darkCard border border-accent/25 rounded-xl px-3.5 py-2 focus:outline-none focus:border-primary text-xs font-bold tracking-wider text-textDark dark:text-cream"
                    />
                    <button
                      type="submit"
                      className="bg-secondary hover:bg-secondary-dark text-cream font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-premium shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[10px] text-highlight mt-1 font-bold">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-success mt-1 font-bold">{couponSuccess}</p>}
              </div>

              {/* Bill Details */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-textLight dark:text-cream/60 font-medium">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-xs text-success font-semibold">
                    <span>Discount ({appliedCoupon.discount}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-textLight dark:text-cream/60 font-medium">
                  <span>GST (5%)</span>
                  <span>₹{taxAmount}</span>
                </div>
                <div className="flex justify-between text-xs text-textLight dark:text-cream/60 font-medium">
                  <span>Shipping Fee</span>
                  {shippingFee === 0 ? (
                    <span className="text-success font-bold uppercase tracking-wider">Free Delivery</span>
                  ) : (
                    <span>₹{shippingFee}</span>
                  )}
                </div>
                {shippingFee > 0 && (
                  <p className="text-[9px] text-highlight font-medium">
                    Add ₹{500 - subtotal} more to unlock <strong>FREE DELIVERY!</strong>
                  </p>
                )}
                <div className="flex justify-between text-base font-outfit font-black text-textDark dark:text-cream border-t border-accent/10 pt-2.5 mt-1.5">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={onClearCart}
                  className="py-3 rounded-full border border-highlight text-highlight font-bold text-xs transition-colors hover:bg-highlight/10"
                >
                  Clear Cart
                </button>
                <button
                  onClick={onCheckout}
                  className="py-3 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold text-xs shadow-premium flex items-center justify-center gap-1.5 hover:shadow-premium-hover scale-100 active:scale-95 transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
