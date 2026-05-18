import React, { useState } from 'react';
import {
  BarChart2, ShoppingBag, PlusCircle, Trash2, Edit, Check, Settings,
  AlertTriangle, Users, Percent, Image, Truck, ChevronRight, X
} from 'lucide-react';
import { COUPONS } from '../data/products';

export default function AdminPanel({
  products,
  setProducts,
  orders,
  setOrders,
  categories,
  onAddToast
}) {
  const [adminTab, setAdminTab] = useState('analytics'); // analytics | orders | products | inventory | coupons
  
  // Product Form Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Ready Mix',
    price: '',
    quantity: '',
    badge: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
    protein: '10g',
    fiber: '6g',
    carbs: '60g',
    fat: '1g'
  });

  // Coupon Form State
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', minPurchase: '', description: '' });
  const [activeCoupons, setActiveCoupons] = useState(COUPONS);

  // Sales calculations
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const averageOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
  
  // Custom Analytics Chart Mock Data
  const weeklySales = [
    { day: 'Mon', sales: 12000 },
    { day: 'Tue', sales: 18000 },
    { day: 'Wed', sales: 15000 },
    { day: 'Thu', sales: 24000 },
    { day: 'Fri', sales: 32000 },
    { day: 'Sat', sales: 29000 },
    { day: 'Sun', sales: 42000 }
  ];
  const maxSale = Math.max(...weeklySales.map(d => d.sales));

  // Handle order status update
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    onAddToast(`Order ${orderId} updated to: ${newStatus}`, 'success');
  };

  // Delete product
  const handleDeleteProduct = (productId) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    onAddToast('Product deleted from inventory', 'warning');
  };

  // Add Coupon
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.discount) {
      onAddToast('Coupon code and discount are required', 'warning');
      return;
    }
    const couponItem = {
      code: newCoupon.code.toUpperCase().trim(),
      discount: parseInt(newCoupon.discount),
      minPurchase: parseInt(newCoupon.minPurchase) || 0,
      description: newCoupon.description || `Get ${newCoupon.discount}% off!`
    };
    setActiveCoupons(prev => [couponItem, ...prev]);
    setNewCoupon({ code: '', discount: '', minPurchase: '', description: '' });
    onAddToast('New Coupon Code activated', 'success');
  };

  // Delete Coupon
  const handleDeleteCoupon = (code) => {
    setActiveCoupons(prev => prev.filter(c => c.code !== code));
    onAddToast('Coupon deactivated', 'warning');
  };

  // Product CRUD Modal Submit
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      onAddToast('Product name and price are required', 'warning');
      return;
    }

    if (editingProduct) {
      // Edit mode
      const updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: productForm.name,
            category: productForm.category,
            price: parseInt(productForm.price),
            quantity: productForm.quantity || '500 g',
            badge: productForm.badge,
            description: productForm.description,
            image: productForm.image,
            nutrition: {
              protein: productForm.protein,
              fiber: productForm.fiber,
              carbs: productForm.carbs,
              fat: productForm.fat
            }
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      onAddToast('Product updated successfully', 'success');
    } else {
      // Add mode
      const newProduct = {
        id: `rm-${Date.now()}`,
        name: productForm.name,
        category: productForm.category,
        price: parseInt(productForm.price),
        quantity: productForm.quantity || '500 g',
        badge: productForm.badge || 'New',
        description: productForm.description || 'Premium healthy organic millet blend.',
        image: productForm.image,
        rating: 4.8,
        reviewsCount: 1,
        nutrition: {
          protein: productForm.protein || '10g',
          fiber: productForm.fiber || '6g',
          carbs: productForm.carbs || '60g',
          fat: productForm.fat || '1g'
        }
      };
      setProducts(prev => [newProduct, ...prev]);
      onAddToast('Product added to catalog', 'success');
    }

    // Reset Form & Close Modal
    setShowAddProductModal(false);
    setEditingProduct(null);
    setProductForm({
      name: '', category: 'Ready Mix', price: '', quantity: '', badge: '', description: '',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
      protein: '10g', fiber: '6g', carbs: '60g', fat: '1g'
    });
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      badge: product.badge || '',
      description: product.description,
      image: product.image,
      protein: product.nutrition?.protein || '10g',
      fiber: product.nutrition?.fiber || '6g',
      carbs: product.nutrition?.carbs || '60g',
      fat: product.nutrition?.fat || '1g'
    });
    setShowAddProductModal(true);
  };

  const handleStockUpdate = (productId, change) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const currentVal = parseInt(p.quantity) || 50;
        const newVal = Math.max(0, currentVal + change);
        return { ...p, quantity: `${newVal} g` };
      }
      return p;
    });
    setProducts(updated);
    onAddToast('Stock updated successfully', 'success');
  };

  return (
    <div className="pt-36 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-accent/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light px-3.5 py-1.5 rounded-full">
            GymMillets Store HQ
          </span>
          <h1 className="text-3xl font-outfit font-black text-textDark dark:text-cream mt-2">Admin Dashboard</h1>
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowAddProductModal(true);
          }}
          className="px-5 py-3 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold text-xs shadow-premium flex items-center gap-1.5"
        >
          <PlusCircle size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Admin Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-4 space-y-1.5">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              adminTab === 'analytics'
                ? 'bg-primary text-cream shadow-premium'
                : 'text-textDark dark:text-cream/80 hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <BarChart2 size={16} />
              <span>Sales Analytics</span>
            </span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              adminTab === 'orders'
                ? 'bg-primary text-cream shadow-premium'
                : 'text-textDark dark:text-cream/80 hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <Truck size={16} />
              <span>Manage Orders</span>
            </span>
            <span className="bg-primary/20 dark:bg-success/20 text-[10px] font-black text-primary dark:text-success-light px-2 py-0.5 rounded-md">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              adminTab === 'products'
                ? 'bg-primary text-cream shadow-premium'
                : 'text-textDark dark:text-cream/80 hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={16} />
              <span>Store Products</span>
            </span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => setAdminTab('inventory')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              adminTab === 'inventory'
                ? 'bg-primary text-cream shadow-premium'
                : 'text-textDark dark:text-cream/80 hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>Inventory Logs</span>
            </span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => setAdminTab('coupons')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              adminTab === 'coupons'
                ? 'bg-primary text-cream shadow-premium'
                : 'text-textDark dark:text-cream/80 hover:bg-primary/10'
            }`}
          >
            <span className="flex items-center gap-2">
              <Percent size={16} />
              <span>Discount Coupons</span>
            </span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* View Details */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: SALES ANALYTICS */}
          {adminTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Analytics Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-darkCard p-5 rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-textLight dark:text-cream/40">Total Revenue</p>
                  <p className="text-2xl font-outfit font-black text-textDark dark:text-cream mt-1">₹{totalSales}</p>
                  <span className="text-[9px] font-bold text-success mt-0.5 block">↑ 14% this week</span>
                </div>
                <div className="bg-white dark:bg-darkCard p-5 rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-textLight dark:text-cream/40">Total Orders Placed</p>
                  <p className="text-2xl font-outfit font-black text-textDark dark:text-cream mt-1">{orders.length}</p>
                  <span className="text-[9px] font-bold text-success mt-0.5 block">↑ 8.2% since yesterday</span>
                </div>
                <div className="bg-white dark:bg-darkCard p-5 rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-textLight dark:text-cream/40">Average Order Value</p>
                  <p className="text-2xl font-outfit font-black text-textDark dark:text-cream mt-1">₹{averageOrderValue}</p>
                  <span className="text-[9px] font-bold text-secondary dark:text-accent mt-0.5 block">High Premium Buyers</span>
                </div>
                <div className="bg-white dark:bg-darkCard p-5 rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-textLight dark:text-cream/40">Conversion Rate</p>
                  <p className="text-2xl font-outfit font-black text-textDark dark:text-cream mt-1">4.82%</p>
                  <span className="text-[9px] font-bold text-success mt-0.5 block">↑ 1.2% industry average</span>
                </div>
              </div>

              {/* Weekly Sales Chart */}
              <div className="bg-white dark:bg-darkCard p-6 rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium">
                <h3 className="text-base font-outfit font-black text-textDark dark:text-cream mb-6">Weekly Sales Growth Profile</h3>
                <div className="flex h-56 items-end justify-between gap-2.5 pt-4">
                  {weeklySales.map((day) => {
                    const heightPercent = Math.round((day.sales / maxSale) * 100);
                    return (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="text-[9px] font-bold text-textLight dark:text-cream/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          ₹{day.sales}
                        </div>
                        <div
                          style={{ height: `${heightPercent - 20}%` }}
                          className="w-full bg-gradient-to-t from-primary to-accent dark:from-success dark:to-accent-light rounded-t-xl group-hover:scale-x-105 transition-all shadow-premium"
                        />
                        <span className="text-[10px] font-bold text-textDark dark:text-cream/70 mt-1">{day.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE ORDERS */}
          {adminTab === 'orders' && (
            <div className="bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-6">
              <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream border-b border-accent/10 pb-4 mb-6">
                Active Order Logs ({orders.length})
              </h3>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-textLight dark:text-cream/50 font-bold">No orders placed in system yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-accent/10 text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 pb-2">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Grand Total</th>
                        <th className="pb-3">Live Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/5 text-sm">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-cream/10 dark:hover:bg-[#252525]">
                          <td className="py-4 font-bold text-textDark dark:text-cream">{order.id}</td>
                          <td className="py-4">
                            <p className="font-semibold text-textDark dark:text-cream">{order.shippingDetails.name}</p>
                            <p className="text-[10px] text-textLight dark:text-cream/50">Contact: {order.shippingDetails.mobile}</p>
                          </td>
                          <td className="py-4 font-black text-textDark dark:text-cream">₹{order.total}</td>
                          <td className="py-4">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              order.status === 'Delivered'
                                ? 'bg-success/20 text-success'
                                : 'bg-primary/20 text-primary dark:bg-success-light/20 dark:text-success-light'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="text-xs font-bold bg-cream/70 dark:bg-[#252525] border border-accent/25 dark:border-accent/5 rounded-xl px-2 py-1.5 text-textDark dark:text-cream"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANAGE PRODUCTS */}
          {adminTab === 'products' && (
            <div className="bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-6">
              <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream border-b border-accent/10 pb-4 mb-6">
                Active Store Catalog ({products.length})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="flex gap-4 p-4 border border-accent/10 dark:border-accent/5 rounded-2xl hover:bg-cream/10 transition-all items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream dark:bg-cream-dark/10">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-textDark dark:text-cream leading-tight">{p.name}</h4>
                        <p className="text-[10px] text-textLight dark:text-cream/50 mt-0.5">{p.category} • ₹{p.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProductClick(p)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="Edit Catalog Details"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-highlight hover:bg-highlight/10 rounded-full transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY */}
          {adminTab === 'inventory' && (
            <div className="bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-6">
              <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream border-b border-accent/10 pb-4 mb-6">
                Inventory Levels & Low Stock Warnings
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-accent/10 text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 pb-2">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Current Stock</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent/5 text-sm">
                    {products.map((p) => {
                      const stockVal = parseInt(p.quantity) || 50;
                      const isLowStock = stockVal < 40;

                      return (
                        <tr key={p.id} className="hover:bg-cream/10">
                          <td className="py-4 font-bold text-textDark dark:text-cream">{p.name}</td>
                          <td className="py-4 text-xs font-bold text-textLight dark:text-cream/50">{p.category}</td>
                          <td className="py-4 font-extrabold text-textDark dark:text-cream">{p.quantity}</td>
                          <td className="py-4">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isLowStock ? 'bg-highlight/20 text-highlight' : 'bg-success/20 text-success'
                            }`}>
                              {isLowStock ? 'Low Stock' : 'Good Stock'}
                            </span>
                          </td>
                          <td className="py-4 text-right space-x-1">
                            <button
                              onClick={() => handleStockUpdate(p.id, -20)}
                              className="px-2 py-1 bg-[#252525] text-cream hover:bg-highlight text-xs font-bold rounded-lg transition-colors"
                            >
                              -20g
                            </button>
                            <button
                              onClick={() => handleStockUpdate(p.id, 20)}
                              className="px-2 py-1 bg-primary text-cream hover:bg-primary-dark text-xs font-bold rounded-lg transition-colors"
                            >
                              +20g
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: DISCOUNTS */}
          {adminTab === 'coupons' && (
            <div className="bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 shadow-premium p-6 space-y-6">
              
              {/* Add Coupon Form */}
              <div>
                <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream pb-3 border-b border-accent/10 mb-4">
                  Activate Discount Coupon
                </h3>
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-textLight dark:text-cream/40">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. GYMBOOST"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                      className="bg-cream/50 dark:bg-darkCard border border-accent/25 rounded-2xl px-3 py-2.5 text-xs font-bold text-textDark dark:text-cream"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-textLight dark:text-cream/40">Discount %</label>
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, discount: e.target.value }))}
                      className="bg-cream/50 dark:bg-darkCard border border-accent/25 rounded-2xl px-3 py-2.5 text-xs font-bold text-textDark dark:text-cream"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-textLight dark:text-cream/40">Min Spend (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={newCoupon.minPurchase}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, minPurchase: e.target.value }))}
                      className="bg-cream/50 dark:bg-darkCard border border-accent/25 rounded-2xl px-3 py-2.5 text-xs font-bold text-textDark dark:text-cream"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-cream font-bold py-2.5 rounded-2xl text-xs transition-colors shadow-premium"
                  >
                    Activate Coupon
                  </button>
                </form>
              </div>

              {/* Coupon List */}
              <div className="border-t border-accent/10 pt-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-textLight dark:text-cream/40 mb-3">Active Coupon Log</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeCoupons.map((c) => (
                    <div key={c.code} className="p-4 bg-cream/30 dark:bg-cream-dark/5 rounded-2xl border border-accent/5 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-primary dark:text-success-light">{c.code}</span>
                          <span className="text-[10px] bg-success/20 text-success px-1.5 py-0.5 rounded font-black">{c.discount}% OFF</span>
                        </div>
                        <p className="text-[10px] text-textLight dark:text-cream/50 mt-1">{c.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="text-highlight hover:text-highlight-dark p-2 hover:bg-highlight/10 rounded-full transition-colors"
                        title="Deactivate coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* CRUD Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white dark:bg-darkCard border border-accent/25 rounded-3xl shadow-premium overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Modal Close */}
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 p-2 bg-cream/70 hover:bg-cream text-textDark rounded-full border border-accent/15"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-2xl font-outfit font-black text-textDark dark:text-cream">
                {editingProduct ? 'Edit Catalog Product' : 'Add Brand New Product'}
              </h3>
              <p className="text-xs text-textLight dark:text-cream/50 mt-1">Configure organic grain categories, pricing models, and specific nutrition facts.</p>
            </div>

            <form onSubmit={productForm ? handleProductSubmit : undefined} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-textLight dark:text-cream/40">Product Title</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Multi-Millet Dosa Mix"
                    className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-textLight dark:text-cream/40">Category Range</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-textLight dark:text-cream/40">Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="240"
                    className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-textLight dark:text-cream/40">Quantity (g/packets)</label>
                  <input
                    type="text"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="500 g"
                    className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-textLight dark:text-cream/40">Promo Badge</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="Best Seller, New"
                    className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-textLight dark:text-cream/40">Unsplash Photo URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                  className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-textLight dark:text-cream/40">Product Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  rows="2"
                  placeholder="Details of natural premium millet ingredients..."
                  className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-2.5 text-xs text-textDark dark:text-cream resize-none"
                />
              </div>

              {/* Nutrition Inputs */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-primary dark:text-success-light mb-2">Nutrition breakdown facts (100g)</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-textLight dark:text-cream/40">Protein (g)</label>
                    <input
                      type="text"
                      value={productForm.protein}
                      onChange={(e) => setProductForm(prev => ({ ...prev, protein: e.target.value }))}
                      className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-textDark dark:text-cream"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-textLight dark:text-cream/40">Fiber (g)</label>
                    <input
                      type="text"
                      value={productForm.fiber}
                      onChange={(e) => setProductForm(prev => ({ ...prev, fiber: e.target.value }))}
                      className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-textDark dark:text-cream"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-textLight dark:text-cream/40">Carbs (g)</label>
                    <input
                      type="text"
                      value={productForm.carbs}
                      onChange={(e) => setProductForm(prev => ({ ...prev, carbs: e.target.value }))}
                      className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-textDark dark:text-cream"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-textLight dark:text-cream/40">Fat (g)</label>
                    <input
                      type="text"
                      value={productForm.fat}
                      onChange={(e) => setProductForm(prev => ({ ...prev, fat: e.target.value }))}
                      className="bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-xl px-2.5 py-1.5 text-xs text-center font-bold text-textDark dark:text-cream"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-6 py-2.5 rounded-full border border-accent text-textDark dark:text-cream font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold text-xs shadow-premium"
                >
                  {editingProduct ? 'Save Catalog Product' : 'Add Brand Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
