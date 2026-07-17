import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, ShieldCheck, MapPin, Truck, HelpCircle } from 'lucide-react';
import { API_BASE } from '../lib/config';

export default function CheckoutView({
  cartItems,
  appliedCoupon,
  onPlaceOrder,
  setActiveView
}) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    alternateMobile: '',
    address: '',
    city: '',
    pincode: '',
    locationUrl: '',
    paymentMethod: 'cod', // cod | card | upi
    cardNo: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setIsLocating(false);
          if (data && data.display_name) {
            const addressParts = data.address || {};
            const road = addressParts.road || '';
            const neighbourhood = addressParts.neighbourhood || addressParts.suburb || '';
            const county = addressParts.county || '';
            const city = addressParts.city || addressParts.town || addressParts.village || '';
            const state = addressParts.state || '';
            const pincode = addressParts.postcode || '';

            // Clean address string
            const mainAddress = [road, neighbourhood, county, state].filter(Boolean).join(', ');

            setFormData(prev => ({
              ...prev,
              address: mainAddress || data.display_name,
              city: city,
              pincode: pincode.replace(/\s+/g, ''),
              locationUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
            }));
          }
        } catch (error) {
          setIsLocating(false);
          setFormData(prev => ({
            ...prev,
            address: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`,
            locationUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
          }));
        }
      },
      (error) => {
        setIsLocating(false);
        alert("Unable to retrieve your location: " + error.message);
      }
    );
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shippingFee = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal - discountAmount + shippingFee + taxAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.mobile.trim() || formData.mobile.trim().length < 10) errors.mobile = 'Enter a valid 10-digit mobile number';
    if (formData.alternateMobile.trim() && formData.alternateMobile.trim().length < 10) {
      errors.alternateMobile = 'Enter a valid 10-digit alternate mobile number';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.trim().length !== 6) errors.pincode = 'Enter a valid 6-digit Pincode';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    return true; // Razorpay handles validations securely inside its checkout portal
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setActiveView('shop');
    }
  };

  const handlePlaceOrderSubmit = async () => {
    const orderDetails = {
      items: cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        variant: item.variant,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      shippingDetails: {
        name: formData.name,
        mobile: formData.mobile,
        alternateMobile: formData.alternateMobile,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        locationUrl: formData.locationUrl
      },
      paymentDetails: {
        method: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay Online'
      },
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      shipping: shippingFee,
      total: grandTotal
    };

    if (formData.paymentMethod === 'cod') {
      onPlaceOrder(orderDetails);
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Step 1: Create server-side order
      const response = await fetch(`${API_BASE}/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal })
      });
      const data = await response.json();

      if (!response.ok || !data.orderId) {
        throw new Error(data.error || 'Failed to initialize payment gateway.');
      }

      // Step 2: Open Razorpay checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TDHCozKmm4gRkG',
        amount: data.amount,
        currency: 'INR',
        name: 'GymMillets',
        description: 'Premium Natural Millet Grains',
        order_id: data.orderId,
        handler: async function (paymentRes) {
          try {
            // Step 3: Verify payment signature
            const verifyRes = await fetch(`${API_BASE}/verify-razorpay-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              onPlaceOrder({
                ...orderDetails,
                paymentDetails: {
                  method: 'Razorpay Online',
                  paymentId: paymentRes.razorpay_payment_id,
                  orderId: paymentRes.razorpay_order_id
                }
              });
            } else {
              setPaymentError(verifyData.error || 'Payment signature verification failed.');
              setIsProcessing(false);
            }
          } catch (err) {
            setPaymentError('Connection lost during payment verification.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.mobile
        },
        theme: {
          color: '#4b6b40'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaymentError(err.message || 'Could not contact payment gateway. Make sure server is running.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-48 sm:pt-52 lg:pt-56 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Back Button */}
      <button
        onClick={handleBackStep}
        className="flex items-center gap-2 text-textLight dark:text-cream/70 hover:text-primary dark:hover:text-success-light font-bold text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>{step === 1 ? 'Back to Shop' : 'Back'}</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Wizard Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between bg-white dark:bg-darkCard p-4 rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-primary text-cream' : 'bg-cream text-textLight dark:bg-[#252525]'
              }`}>
                {step > 1 ? <Check size={14} /> : '1'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-textDark dark:text-cream">Delivery</span>
            </div>
            <div className="flex-grow h-0.5 bg-accent/20 dark:bg-accent/5 mx-2" />
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-primary text-cream' : 'bg-cream text-textLight dark:bg-[#252525]'
              }`}>
                {step > 2 ? <Check size={14} /> : '2'}
              </span>
              <span className="text-xs sm:text-sm font-bold text-textDark dark:text-cream">Payment</span>
            </div>
            <div className="flex-grow h-0.5 bg-accent/20 dark:bg-accent/5 mx-2" />
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 3 ? 'bg-primary text-cream' : 'bg-cream text-textLight dark:bg-[#252525]'
              }`}>
                3
              </span>
              <span className="text-xs sm:text-sm font-bold text-textDark dark:text-cream">Review</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-6 sm:p-8">
            
            {/* Step 1: Delivery Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-b border-accent/10 pb-4">
                  <h2 className="text-xl font-outfit font-black text-textDark dark:text-cream flex items-center gap-2">
                    <MapPin className="text-primary dark:text-success-light" size={20} />
                    <span>Delivery Address Details</span>
                  </h2>
                  <p className="text-xs text-textLight dark:text-cream/50 mt-1">Please enter your shipping address where we should deliver your fresh millet foods.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream"
                    />
                    {formErrors.name && <span className="text-[10px] text-highlight font-bold">{formErrors.name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">10-Digit Mobile No</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream"
                    />
                    {formErrors.mobile && <span className="text-[10px] text-highlight font-bold">{formErrors.mobile}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">Alternate Mobile No</label>
                    <input
                      type="tel"
                      name="alternateMobile"
                      value={formData.alternateMobile}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543211 (Optional)"
                      className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream"
                    />
                    {formErrors.alternateMobile && <span className="text-[10px] text-highlight font-bold">{formErrors.alternateMobile}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">Street Address & Landmark</label>
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      disabled={isLocating}
                      className="flex items-center gap-1 text-[11px] font-bold text-primary dark:text-success-light hover:underline"
                    >
                      📍 <span>{isLocating ? 'LOCATING...' : 'LOCATE ME'}</span>
                    </button>
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Flat No, Building Name, Street Name, Near landmark..."
                    className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream resize-none"
                  />
                  {formData.locationUrl && (
                    <div className="text-[11px] font-bold text-primary dark:text-success-light flex items-center gap-1.5 mt-1 bg-primary/5 dark:bg-success/5 p-2 rounded-xl border border-accent/10 dark:border-accent/5">
                      <span>📍 Location Link:</span>
                      <a href={formData.locationUrl} target="_blank" rel="noopener noreferrer" className="underline truncate hover:text-primary-dark">
                        {formData.locationUrl}
                      </a>
                    </div>
                  )}
                  {formErrors.address && <span className="text-[10px] text-highlight font-bold">{formErrors.address}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Bangalore"
                      className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream"
                    />
                    {formErrors.city && <span className="text-[10px] text-highlight font-bold">{formErrors.city}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">6-Digit Pincode</label>
                    <input
                      type="number"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 560001"
                      className="bg-cream/50 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold text-textDark dark:text-cream"
                    />
                    {formErrors.pincode && <span className="text-[10px] text-highlight font-bold">{formErrors.pincode}</span>}
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full bg-primary hover:bg-primary-dark text-cream font-bold py-3.5 rounded-full shadow-premium flex items-center justify-center gap-1 hover:shadow-premium-hover scale-100 active:scale-95 transition-all text-sm mt-4"
                >
                  <span>Continue to Payment</span>
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="border-b border-accent/10 pb-4">
                  <h2 className="text-xl font-outfit font-black text-textDark dark:text-cream flex items-center gap-2">
                    <CreditCard className="text-primary dark:text-success-light" size={20} />
                    <span>Select Payment Option</span>
                  </h2>
                  <p className="text-xs text-textLight dark:text-cream/50 mt-1">Select from Cash on Delivery, Credit/Debit Card or immediate UPI.</p>
                </div>

                {/* Option Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5 text-primary dark:border-success-light dark:text-success-light'
                        : 'border-accent/20 bg-transparent text-textDark dark:text-cream hover:bg-primary/5'
                    }`}
                  >
                    <Truck size={24} className="mb-2" />
                    <span className="text-xs font-bold">Cash on Delivery</span>
                    <span className="text-[9px] text-textLight dark:text-cream/50 mt-0.5">Pay at door</span>
                  </button>

                  <button
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-primary bg-primary/5 text-primary dark:border-success-light dark:text-success-light'
                        : 'border-accent/20 bg-transparent text-textDark dark:text-cream hover:bg-primary/5'
                    }`}
                  >
                    <CreditCard size={24} className="mb-2" />
                    <span className="text-xs font-bold">Credit/Debit Card</span>
                    <span className="text-[9px] text-textLight dark:text-cream/50 mt-0.5">Visa / Mastercard</span>
                  </button>

                  <button
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                      formData.paymentMethod === 'upi'
                        ? 'border-primary bg-primary/5 text-primary dark:border-success-light dark:text-success-light'
                        : 'border-accent/20 bg-transparent text-textDark dark:text-cream hover:bg-primary/5'
                    }`}
                  >
                    <span className="text-base font-black italic tracking-wide text-secondary mb-2 block dark:text-accent-light">UPI</span>
                    <span className="text-xs font-bold">PhonePe / GPay / BHIM</span>
                    <span className="text-[9px] text-textLight dark:text-cream/50 mt-0.5">Instant secure transfer</span>
                  </button>
                </div>

                {paymentError && (
                  <div className="p-3 bg-highlight/15 text-highlight border border-highlight/30 rounded-2xl text-xs font-bold mt-4">
                    ⚠️ {paymentError}
                  </div>
                )}

                <button
                  onClick={formData.paymentMethod === 'cod' ? handleNextStep : handlePlaceOrderSubmit}
                  disabled={isProcessing}
                  className={`w-full text-cream font-bold py-3.5 rounded-full shadow-premium flex items-center justify-center gap-1 hover:shadow-premium-hover scale-100 active:scale-95 transition-all text-sm mt-6 ${
                    isProcessing ? 'bg-gray-400 cursor-not-allowed opacity-75' : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  <span>
                    {isProcessing
                      ? 'PROCESSING PAYMENT...'
                      : formData.paymentMethod === 'cod'
                      ? 'Review Order Summary'
                      : `Continue with Payment (₹${grandTotal})`}
                  </span>
                </button>
              </div>
            )}

            {/* Step 3: Summary & Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="border-b border-accent/10 pb-4">
                  <h2 className="text-xl font-outfit font-black text-textDark dark:text-cream flex items-center gap-2">
                    <ShieldCheck className="text-primary dark:text-success-light" size={20} />
                    <span>Review & Confirm Order</span>
                  </h2>
                  <p className="text-xs text-textLight dark:text-cream/50 mt-1">Please inspect your shipping address and payment method before completing order.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Shipping Recap */}
                  <div className="bg-cream/30 dark:bg-cream-dark/5 border border-accent/5 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-primary dark:text-success-light uppercase tracking-wider">Delivery Details</p>
                    <p className="text-sm font-extrabold text-textDark dark:text-cream">{formData.name}</p>
                    <p className="text-xs text-textLight dark:text-cream/70 leading-relaxed font-semibold">
                      {formData.address}, {formData.city} - {formData.pincode}
                    </p>
                    <p className="text-xs text-textLight dark:text-cream/50 font-bold">Contact: +91 {formData.mobile}</p>
                    {formData.locationUrl && (
                      <p className="text-xs text-primary dark:text-success-light font-bold flex items-center gap-1">
                        <span>📍 Location Link:</span>
                        <a href={formData.locationUrl} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-[180px]">
                          Google Maps Link
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Payment Recap */}
                  <div className="bg-cream/30 dark:bg-cream-dark/5 border border-accent/5 p-4 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-primary dark:text-success-light uppercase tracking-wider">Payment Details</p>
                    <p className="text-sm font-extrabold text-textDark dark:text-cream uppercase flex items-center gap-1.5">
                      <Check className="text-success" size={16} />
                      <span>{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod === 'card' ? 'Credit Card' : 'UPI Instant'}</span>
                    </p>
                    <p className="text-xs text-textLight dark:text-cream/50 leading-relaxed font-semibold">
                      {formData.paymentMethod === 'cod' ? 'Pay upon delivery at your door step.' : formData.paymentMethod === 'card' ? `Card ending *${formData.cardNo.slice(-4)}` : `UPI ID: ${formData.upiId}`}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-2 p-3 bg-success/15 rounded-2xl text-success border border-success/30 mb-6">
                    <ShieldCheck size={18} />
                    <span className="text-xs font-bold">Safe and Secure SSL checkout. 100% pure natural food guarantee.</span>
                  </div>

                  {paymentError && (
                    <div className="p-3 bg-highlight/15 text-highlight border border-highlight/30 rounded-2xl text-xs font-bold mb-4">
                      ⚠️ {paymentError}
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrderSubmit}
                    disabled={isProcessing}
                    className={`w-full text-cream font-bold py-4 rounded-full shadow-premium flex items-center justify-center gap-1.5 hover:shadow-premium-hover scale-100 active:scale-95 transition-all text-sm ${
                      isProcessing ? 'bg-gray-400 cursor-not-allowed opacity-75' : 'bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    <span>{isProcessing ? 'PROCESSING PAYMENT...' : `PLACE ORDER (₹${grandTotal})`}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-6 space-y-6">
          <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream pb-3 border-b border-accent/10">Order Summary</h3>

          {/* Item List */}
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={`${item.product.id}-${item.variant || 'none'}`} className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream dark:bg-cream-dark/10 flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-xs font-bold text-textDark dark:text-cream truncate leading-tight">{item.product.name}</h4>
                  <p className="text-[10px] text-textLight dark:text-cream/50 mt-0.5 truncate">
                    {item.variant ? `Variant: ${item.variant} • ` : ''}Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-xs font-bold text-textDark dark:text-cream">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 border-t border-accent/10 pt-4 text-xs font-medium text-textLight dark:text-cream/60">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-success font-semibold">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{taxAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              {shippingFee === 0 ? (
                <span className="text-success font-bold uppercase">Free</span>
              ) : (
                <span>₹{shippingFee}</span>
              )}
            </div>
            <div className="flex justify-between text-base font-outfit font-black text-textDark dark:text-cream border-t border-accent/10 pt-3 mt-2">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
