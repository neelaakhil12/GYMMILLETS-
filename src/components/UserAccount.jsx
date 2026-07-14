import React, { useState } from 'react';
import { User, Calendar, DollarSign, CreditCard, ChevronRight, FileText, Smartphone, Edit2, Check, X, Shield, MapPin, Eye } from 'lucide-react';

export default function UserAccount({ currentUser, setCurrentUser, orders, setActiveView, onAddToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    mobile: currentUser?.mobile || ''
  });

  // Filter orders related to this logged-in user
  const userOrders = orders.filter(
    order => order.userEmail === currentUser?.email || order.shippingDetails?.mobile === currentUser?.mobile
  );

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      onAddToast('Name cannot be empty.', 'warning');
      return;
    }
    const updatedUser = {
      ...currentUser,
      name: editForm.name,
      mobile: editForm.mobile
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setIsEditing(false);
    onAddToast('Profile details updated successfully!', 'success');
  };

  const handleDownloadInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      onAddToast('Popup blocker prevented downloading invoice. Please allow popups.', 'error');
      return;
    }

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #edf2f7; font-size: 13px;">
          <div style="font-weight: 600;">${item.name}</div>
          ${item.variant ? `<div style="font-size: 11px; color: #718096; margin-top: 2px;">Variant: ${item.variant}</div>` : ''}
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #edf2f7; text-align: center; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #edf2f7; text-align: right; font-size: 13px;">₹${item.price}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #edf2f7; text-align: right; font-size: 13px; font-weight: 600;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 500 ? 0 : 40;
    const gst = Math.round(subtotal * 0.05);
    const discount = order.appliedCoupon ? (subtotal * order.appliedCoupon.discount) / 100 : 0;
    const grandTotal = subtotal - discount + shippingFee + gst;

    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Poppins', sans-serif; padding: 40px; color: #2d3748; background: #fff; line-height: 1.5; }
            .invoice-card { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 24px; }
            .logo { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; color: #4b6b40; display: flex; align-items: center; gap: 8px; }
            .details { display: flex; justify-content: space-between; margin-top: 30px; margin-bottom: 30px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f7fafc; padding: 12px 10px; font-weight: bold; text-align: left; font-size: 11px; text-transform: uppercase; border-bottom: 2px solid #edf2f7; color: #718096; }
            .summary { width: 280px; margin-left: auto; margin-top: 30px; font-size: 14px; border-top: 2px solid #edf2f7; padding-top: 15px; }
            .summary-row { display: flex; justify-content: space-between; padding: 6px 0; }
            .total { font-weight: 800; border-top: 2px dashed #edf2f7; padding-top: 12px; color: #4b6b40; font-size: 18px; margin-top: 6px; }
            .footer { text-align: center; margin-top: 60px; font-size: 12px; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 24px; }
            @media print {
              body { padding: 0; background: none; }
              .invoice-card { border: none; box-shadow: none; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div>
                <div class="logo">🌾 GymMillets</div>
                <p style="font-size: 12px; color: #718096; margin: 4px 0 0 0;">100% Premium Natural Millet Foods & Premixes</p>
              </div>
              <div style="text-align: right;">
                <h2 style="margin: 0; color: #4b6b40; font-family: 'Outfit', sans-serif; font-weight: 800;">INVOICE</h2>
                <p style="font-size: 13px; font-weight: 600; color: #4b6b40; margin: 4px 0 0 0;">ID: ${order.id}</p>
              </div>
            </div>
            <div class="details">
              <div>
                <h4 style="margin: 0 0 8px 0; color: #a0aec0; text-transform: uppercase; font-size: 11px; font-weight: 800; letter-spacing: 0.5px;">Billed To:</h4>
                <p style="font-weight: bold; margin: 0; font-size: 15px;">${order.shippingDetails?.name || 'Customer'}</p>
                <p style="margin: 4px 0 0 0; color: #4a5568;">${order.shippingDetails?.address || ''}</p>
                <p style="margin: 2px 0 0 0; color: #4a5568;">${order.shippingDetails?.city || ''} - ${order.shippingDetails?.pincode || ''}</p>
                <p style="margin: 6px 0 0 0; color: #4a5568; font-weight: 600;">Mobile: ${order.shippingDetails?.mobile || ''}</p>
              </div>
              <div style="text-align: right;">
                <h4 style="margin: 0 0 8px 0; color: #a0aec0; text-transform: uppercase; font-size: 11px; font-weight: 800; letter-spacing: 0.5px;">Invoice Details:</h4>
                <p style="margin: 0;">Date: 17th May, 2026</p>
                <p style="margin: 4px 0 0 0;">Payment Method: ${order.paymentDetails?.method || 'UPI/Card'}</p>
                <p style="margin: 6px 0 0 0; font-weight: bold; color: #4b6b40; font-size: 14px;">Status: Paid</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th style="text-align: center; width: 60px;">Qty</th>
                  <th style="text-align: right; width: 100px;">Price</th>
                  <th style="text-align: right; width: 100px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹${subtotal}</span>
              </div>
              ${discount > 0 ? `
              <div class="summary-row" style="color: #e53e3e;">
                <span>Discount</span>
                <span>-₹${discount}</span>
              </div>` : ''}
              <div class="summary-row">
                <span>GST (5%)</span>
                <span>₹${gst}</span>
              </div>
              <div class="summary-row">
                <span>Delivery Fee</span>
                <span>₹${shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div class="summary-row total">
                <span>Grand Total</span>
                <span>₹${grandTotal}</span>
              </div>
            </div>
            <div class="footer">
              <p style="font-weight: 600; color: #4b6b40;">Thank you for supporting natural organic diet systems!</p>
              <p style="font-size: 10px; margin-top: 5px;">This is a system generated document. No physical signature is required.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  return (
    <div className="pt-48 sm:pt-52 lg:pt-56 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen space-y-8" data-aos="fade-up">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream">My Profile Account</h1>
        <p className="text-xs sm:text-sm text-textLight dark:text-cream/50 mt-1">Manage your profile details and view past order history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-darkCard border border-accent/15 dark:border-accent/5 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-success/15 border-2 border-primary/20 flex items-center justify-center text-3xl font-outfit font-black text-primary dark:text-success-light">
                {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-lg font-outfit font-bold text-textDark dark:text-cream">
                  {currentUser?.name || 'Natural Diet Guest'}
                </h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-success-light px-2.5 py-0.5 bg-primary/10 dark:bg-success/10 rounded-full mt-1 inline-block">
                  Verified Client
                </span>
              </div>
            </div>

            <div className="border-t border-accent/10 dark:border-cream/5 pt-6">
              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase text-textLight dark:text-cream/40">Your Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream font-bold focus:outline-none focus:border-primary/60"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase text-textLight dark:text-cream/40">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={editForm.mobile}
                      onChange={e => setEditForm(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '') }))}
                      className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream font-bold focus:outline-none focus:border-primary/60"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary-dark text-cream font-bold py-2 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all scale-100 active:scale-95"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ name: currentUser?.name || '', mobile: currentUser?.mobile || '' });
                      }}
                      className="flex-1 bg-cream hover:bg-cream/80 text-textDark border border-accent/25 font-bold py-2 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cream/70 dark:bg-[#252525] rounded-xl border border-accent/10">
                      <User size={16} className="text-primary dark:text-success-light" />
                    </div>
                    <div>
                      <p className="text-[10px] text-textLight dark:text-cream/40 font-extrabold uppercase">Full Name</p>
                      <p className="text-sm font-bold text-textDark dark:text-cream">{currentUser?.name || 'Not Provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cream/70 dark:bg-[#252525] rounded-xl border border-accent/10">
                      <Shield size={16} className="text-primary dark:text-success-light" />
                    </div>
                    <div>
                      <p className="text-[10px] text-textLight dark:text-cream/40 font-extrabold uppercase">Verified Email</p>
                      <p className="text-sm font-bold text-textDark dark:text-cream truncate max-w-[200px]">{currentUser?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cream/70 dark:bg-[#252525] rounded-xl border border-accent/10">
                      <Smartphone size={16} className="text-primary dark:text-success-light" />
                    </div>
                    <div>
                      <p className="text-[10px] text-textLight dark:text-cream/40 font-extrabold uppercase">Mobile Contact</p>
                      <p className="text-sm font-bold text-textDark dark:text-cream">{currentUser?.mobile || 'Not Set'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-4 bg-primary/10 hover:bg-primary/20 text-primary dark:text-success-light dark:bg-success/10 dark:hover:bg-success/15 font-bold py-2.5 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Edit2 size={13} />
                    <span>Edit Profile Details</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-darkCard border border-accent/15 dark:border-accent/5 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
            <h2 className="text-xl font-outfit font-black text-textDark dark:text-cream flex items-center gap-2">
              <span>🛍️</span>
              <span>Past Orders History</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-cream dark:bg-[#252525] text-textLight dark:text-cream/50 rounded-full">
                {userOrders.length}
              </span>
            </h2>

            {userOrders.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <span className="text-4xl block">🥗</span>
                <div>
                  <h3 className="text-sm font-bold text-textDark dark:text-cream">No Orders Found</h3>
                  <p className="text-xs text-textLight dark:text-cream/50 mt-1 max-w-xs mx-auto">
                    You haven't placed any premium natural millet orders yet. Let's add some items to your kitchen!
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('shop')}
                  className="px-6 py-2 bg-primary hover:bg-primary-dark text-cream font-bold text-xs rounded-full transition-all"
                >
                  Shop Millet Foods
                </button>
              </div>
            ) : (
              <div className="space-y-6 divide-y divide-accent/10 dark:divide-cream/5">
                {userOrders.map((order, idx) => {
                  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const isFirst = idx === 0;

                  return (
                    <div key={order.id} className={`pt-6 ${isFirst ? 'pt-0' : ''} space-y-4`}>
                      {/* Order Info Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-cream/20 dark:bg-cream-dark/5 p-4.5 rounded-2xl border border-accent/10">
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-primary dark:text-success-light uppercase tracking-wider">
                            Order {order.id}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-textLight dark:text-cream/50">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} /> 17th May, 2026
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <CreditCard size={13} /> {order.paymentDetails?.method || 'UPI/Card'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-right sm:text-right">
                            <p className="text-[10px] text-textLight dark:text-cream/40 font-extrabold uppercase">Total Paid</p>
                            <p className="text-base font-black text-textDark dark:text-cream">₹{order.total}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                              order.status === 'Delivered'
                                ? 'bg-success/20 text-success dark:bg-success/15 dark:text-success-light'
                                : 'bg-highlight/20 text-highlight dark:bg-highlight/15 dark:text-highlight'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-3 px-1">
                        {order.items.map(item => (
                          <div key={item.id + (item.variant || '')} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-accent/15 shadow-sm" />
                              <div>
                                <h4 className="text-xs font-bold text-textDark dark:text-cream leading-tight">{item.name}</h4>
                                <p className="text-[10px] text-textLight dark:text-cream/50 mt-0.5">
                                  {item.variant ? `Variant: ${item.variant} | ` : ''}₹{item.price} x {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs font-extrabold text-textDark dark:text-cream">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-textLight dark:text-cream/50">
                          <MapPin size={14} className="text-primary dark:text-success-light" />
                          <span className="truncate max-w-[280px]">
                            {order.shippingDetails?.address}, {order.shippingDetails?.city}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {order.shippingDetails?.courierTrackingUrl && (
                            <a
                              href={order.shippingDetails.courierTrackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-1 transition-all active:scale-95"
                            >
                              <span>🚚</span>
                              <span>Track Order</span>
                            </a>
                          )}
                          
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="px-4 py-1.5 bg-primary hover:bg-primary-dark dark:bg-success dark:hover:bg-success-dark text-cream rounded-full text-xs font-bold shadow-sm flex items-center gap-1 transition-all active:scale-95"
                          >
                            <FileText size={13} />
                            <span>Download Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
