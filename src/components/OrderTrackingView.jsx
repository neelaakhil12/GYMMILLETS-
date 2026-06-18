import React, { useEffect, useState } from 'react';
import { ShoppingBag, MapPin, Truck, Phone, MessageSquare, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function OrderTrackingView({ activeOrder, setActiveView }) {
  const [dots, setDots] = useState('');

  // Floating dots animation for loading states
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  if (!activeOrder) {
    return (
      <div className="pt-48 sm:pt-52 lg:pt-56 pb-20 px-4 max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-cream dark:bg-darkCard flex items-center justify-center text-4xl shadow-premium animate-bounce">
          📦
        </div>
        <div>
          <h2 className="text-2xl font-outfit font-black text-textDark dark:text-cream">No Active Orders</h2>
          <p className="text-xs sm:text-sm text-textLight dark:text-cream/50 mt-2 max-w-sm mx-auto font-medium">
            You don't have any orders currently in progress. Place a premium millet order to track it in real-time!
          </p>
        </div>
        <button
          onClick={() => setActiveView('shop')}
          className="px-8 py-3.5 rounded-full bg-primary text-cream font-bold shadow-premium hover:shadow-premium-hover scale-100 hover:scale-[1.02] active:scale-95 transition-all text-sm"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  // Determine active stepper state
  const milestones = [
    { key: 'placed', label: 'Order Placed', time: 'Just Now', desc: 'We received your healthy millet request.' },
    { key: 'confirmed', label: 'Order Confirmed', time: '1 min ago', desc: 'GymMillets kitchen accepted your order.' },
    { key: 'preparing', label: 'Preparing', time: 'Active', desc: 'Crafting in our clean organic kitchen.' },
    { key: 'out_for_delivery', label: 'Out for Delivery', time: 'Pending', desc: 'Millet courier executive has picked up.' },
    { key: 'delivered', label: 'Delivered', time: 'Pending', desc: 'Delivered hot & fresh to your home.' }
  ];

  const getMilestoneIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Confirmed': return 1;
      case 'Preparing': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const activeIndex = getMilestoneIndex(activeOrder.status);

  return (
    <div className="pt-48 sm:pt-52 lg:pt-56 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen">
      
      {/* Header Cards */}
      <div className="bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-6 sm:p-8 space-y-6">
        
        {/* Title Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-accent/10 pb-6 gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-success/20 text-success dark:bg-success/25 dark:text-success-light px-3 py-1 rounded-full">
              Live Order Status
            </span>
            <h1 className="text-2xl sm:text-3xl font-outfit font-black text-textDark dark:text-cream mt-2">
              ID: {activeOrder.id}
            </h1>
            <p className="text-xs text-textLight dark:text-cream/50 font-bold mt-1">Placing Date: 17th May, 2026</p>
          </div>

          <div className="flex items-center gap-3 bg-cream/70 dark:bg-cream-dark/10 p-3 rounded-2xl border border-accent/10">
            <Clock size={20} className="text-primary dark:text-success-light" />
            <div>
              <p className="text-[10px] text-textLight dark:text-cream/50 font-extrabold uppercase tracking-wide">Estimated Arrival</p>
              <p className="text-sm font-extrabold text-textDark dark:text-cream">
                {activeOrder.status === 'Delivered' ? 'Delivered successfully!' : '25-35 Minutes'}
              </p>
            </div>
          </div>
        </div>

        {/* Stepper Pipeline */}
        <div className="space-y-8 py-4">
          {milestones.map((m, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;
            const isPending = index > activeIndex;

            return (
              <div key={m.key} className="flex gap-4 relative group">
                {/* Vertical Connector Line */}
                {index < milestones.length - 1 && (
                  <div className={`absolute top-8 left-4 w-0.5 h-12 -ml-px ${
                    index < activeIndex ? 'bg-success' : 'bg-accent/20 dark:bg-accent/5'
                  }`} />
                )}

                {/* Milestone Node Dot */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                  isCompleted
                    ? 'bg-success text-cream shadow-premium'
                    : isActive
                    ? 'bg-primary dark:bg-success-light text-cream animate-pulse ring-4 ring-primary/20 dark:ring-success-light/20 shadow-premium'
                    : 'bg-cream dark:bg-[#252525] border border-accent/20 text-textLight'
                }`}>
                  {isCompleted ? (
                    <CheckCircle size={16} />
                  ) : isActive ? (
                    <Clock size={16} />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Milestone Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`text-sm sm:text-base font-outfit font-extrabold ${
                      isActive
                        ? 'text-primary dark:text-success-light'
                        : isCompleted
                        ? 'text-success'
                        : 'text-textDark dark:text-cream/70'
                    }`}>
                      {m.label}
                      {isActive && m.label !== 'Delivered' && (
                        <span className="text-xs font-medium italic ml-1">
                          {dots}
                        </span>
                      )}
                    </h3>
                    <span className={`text-[10px] font-bold ${
                      isActive ? 'text-primary dark:text-success-light' : 'text-textLight dark:text-cream/40'
                    }`}>
                      {isActive && activeOrder.status === 'Preparing' ? 'Active' : isCompleted ? m.time : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-textLight dark:text-cream/50 mt-0.5 leading-relaxed font-semibold">
                    {m.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Courier Details Card */}
        {activeOrder.status !== 'Delivered' && activeIndex >= 2 && (
          <div className="bg-cream/40 dark:bg-cream-dark/5 p-4 rounded-3xl border border-accent/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-accent/20 border border-primary/20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                  alt="Millet Driver Partner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs text-textLight dark:text-cream/50 font-extrabold uppercase tracking-wide">Millet Courier Partner</p>
                <p className="text-sm font-extrabold text-textDark dark:text-cream">Sandeep Kumar</p>
                <p className="text-[10px] text-success font-bold">5.0 Star rated delivery executive</p>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href="tel:+919876543210"
                className="p-3 bg-white dark:bg-[#252525] hover:bg-primary hover:text-cream border border-accent/15 text-primary rounded-full transition-colors"
                title="Call Executive"
              >
                <Phone size={16} />
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white dark:bg-[#252525] hover:bg-success hover:text-cream border border-accent/15 text-success rounded-full transition-colors"
                title="WhatsApp Courier"
              >
                <MessageSquare size={16} />
              </a>
            </div>
          </div>
        )}

        {/* Order Details Accordion Recap */}
        <div className="border-t border-accent/10 pt-6 space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-textLight dark:text-cream/40">Basket Item Listing</h3>
          <div className="space-y-3">
            {activeOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-cream/20 dark:bg-cream-dark/5 p-3 rounded-2xl border border-accent/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream dark:bg-cream-dark/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-textDark dark:text-cream">{item.name}</h4>
                    <p className="text-[10px] text-textLight dark:text-cream/50 mt-0.5">
                      {item.variant ? `Variant: ${item.variant} • ` : ''}Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-textDark dark:text-cream">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs font-bold text-textLight dark:text-cream/60 pt-2 border-t border-accent/5">
            <span>Payment Method: {activeOrder.paymentDetails.method}</span>
            <span className="text-sm font-black text-textDark dark:text-cream">Paid: ₹{activeOrder.total}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
