import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart2, ShoppingBag, PlusCircle, Trash2, Edit, Check,
  Percent, Truck, X, Upload, Loader, Download, Tag, ImageOff,
  TrendingUp, Package, ClipboardList,
  Search, CheckCircle, Clock, ShoppingCart, Eye,
  LayoutGrid, LogOut, AlertTriangle, RefreshCw, Image
} from 'lucide-react';
import { uploadImageToCloudinary } from '../lib/cloudinary';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ₹ icon replacement for revenue cards
const RupeeIcon = ({ size = 18 }) => (
  <span style={{ fontSize: size, fontWeight: 900, lineHeight: 1, fontFamily: 'inherit' }}>₹</span>
);

// ─── Status colour helpers ────────────────────────────────────────────────────
const STATUS_COLORS = {
  Placed:             'bg-blue-500/20 text-blue-400 border-blue-400/20',
  Confirmed:          'bg-yellow-500/20 text-yellow-400 border-yellow-400/20',
  Preparing:          'bg-orange-500/20 text-orange-400 border-orange-400/20',
  'Out for Delivery': 'bg-purple-500/20 text-purple-400 border-purple-400/20',
  Delivered:          'bg-green-500/20 text-green-400 border-green-400/20',
};

const inputCls =
  'bg-cream/40 dark:bg-[#252525] border border-accent/25 rounded-2xl px-4 py-3 text-sm text-textDark dark:text-cream font-medium focus:outline-none focus:border-primary/60 transition-colors';

// ─── Shared card wrapper ────────────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-darkCard rounded-3xl border border-accent/10 dark:border-accent/5 ${className}`}>
    {children}
  </div>
);

// ─── Default empty product form ────────────────────────────────────────────────
const emptyProductForm = (firstCat = 'Ready Mix') => ({
  name: '', category: firstCat, price: '', quantity: '',
  badge: '', description: '', image: '',
  protein: '10g', fiber: '6g', carbs: '60g', fat: '1g',
});

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminPanel({
  products, setProducts,
  orders, setOrders,
  categories, onUpdateCategories,
  dbCoupons, setDbCoupons,
  heroSlides = [], onUpdateHeroSlides,
  onAddToast,
  onDbAddProduct, onDbUpdateProduct, onDbDeleteProduct,
  onDbUpdateOrderStatus,
  onDbUpdateOrderShippingDetails,
  onDbAddCoupon, onDbDeleteCoupon,
  onAdminLogout,
}) {
  const [tab, setTab] = useState('dashboard');

  // ── Product state ──────────────────────────────────────────────────────────
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct]     = useState(null);
  const [imageUploading, setImageUploading]     = useState(false);
  const [imagePreview, setImagePreview]         = useState(null);
  const [productSearch, setProductSearch]       = useState('');
  const [inlineEdit, setInlineEdit]             = useState({}); // { [id]: { price, quantity } }
  const [productForm, setProductForm]           = useState(emptyProductForm(categories?.[0]?.name));
  const [deleteConfirm, setDeleteConfirm]       = useState(null); // product id to confirm delete
  const [selectedViewOrder, setSelectedViewOrder] = useState(null);
  const [trackingInput, setTrackingInput]       = useState('');

  useEffect(() => {
    if (selectedViewOrder) {
      setTrackingInput(selectedViewOrder.shippingDetails?.courierTrackingUrl || '');
    }
  }, [selectedViewOrder]);

  const handleSaveTracking = async () => {
    if (!selectedViewOrder) return;
    const updatedShipping = {
      ...selectedViewOrder.shippingDetails,
      courierTrackingUrl: trackingInput
    };
    
    // Update in memory
    setOrders(prev => prev.map(o => o.id === selectedViewOrder.id ? { ...o, shippingDetails: updatedShipping } : o));
    setSelectedViewOrder(prev => ({ ...prev, shippingDetails: updatedShipping }));
    
    // Persist to Supabase
    if (onDbUpdateOrderShippingDetails) {
      try {
        await onDbUpdateOrderShippingDetails(selectedViewOrder.id, updatedShipping);
        onAddToast('Tracking URL updated successfully!', 'success');
      } catch (err) {
        onAddToast('Failed to update tracking URL in database.', 'warning');
      }
    } else {
      onAddToast('Tracking URL updated in session.', 'success');
    }
  };

  // ── Pricing & Quantity Configuration State ───────────────────────────────
  const [pricingTab, setPricingTab] = useState('solid'); // solid | liquid | pieces | packets
  const [solidConfig, setSolidConfig] = useState([
    { label: '250g', price: '', enabled: true },
    { label: '500g', price: '', enabled: true },
    { label: '1kg', price: '', enabled: true }
  ]);
  const [liquidConfig, setLiquidConfig] = useState([
    { label: '250ML', price: '', enabled: true },
    { label: '500ML', price: '', enabled: true },
    { label: '1LT', price: '', enabled: true }
  ]);
  const [piecesConfig, setPiecesConfig] = useState([
    { label: '1 Pc', price: '', enabled: true },
    { label: '2 Pcs', price: '', enabled: true },
    { label: '3 Pcs', price: '', enabled: true }
  ]);
  const [packetConfig, setPacketConfig] = useState([
    { label: '1 Pkt', price: '', enabled: true },
    { label: '2 Pkts', price: '', enabled: true },
    { label: '3 Pkts', price: '', enabled: true }
  ]);

  // ── Category state ─────────────────────────────────────────────────────────
  const [newCatName, setNewCatName]       = useState('');
  const [newCatImage, setNewCatImage]     = useState('');
  const [catImageUploading, setCatImageUploading] = useState(false);
  const [editingCat, setEditingCat]       = useState(null); // { index, value }

  // ── Order state ────────────────────────────────────────────────────────────
  const [orderFilter, setOrderFilter]     = useState('All');

  // ── Coupon state ───────────────────────────────────────────────────────────
  const [newCoupon, setNewCoupon]         = useState({ code: '', discount: '', minPurchase: '', description: '' });
  const activeCoupons                     = dbCoupons;
  const setActiveCoupons                  = setDbCoupons;

  // ── Hero Slides state & handlers ───────────────────────────────────────────
  const [slideForm, setSlideForm]                     = useState({ name: '', alt: '', image: '' });
  const [slideImagePreview, setSlideImagePreview]     = useState(null);
  const [slideImageUploading, setSlideImageUploading] = useState(false);
  const [editingSlide, setEditingSlide]               = useState(null);

  const handleSlideImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlideImagePreview(URL.createObjectURL(file));
    setSlideImageUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setSlideForm(prev => ({ ...prev, image: url }));
      setSlideImagePreview(url);
      onAddToast('Slide image uploaded to Cloudinary!', 'success');
    } catch (err) {
      onAddToast('Upload failed. Paste a URL instead.', 'warning');
    } finally {
      setSlideImageUploading(false);
    }
  };

  const handleUpdateSlideImage = async (index, file) => {
    onAddToast('Uploading new slide image...', 'info');
    try {
      const url = await uploadImageToCloudinary(file);
      setEditingSlide(prev => ({ ...prev, image: url }));
      onAddToast('New slide image uploaded!', 'success');
    } catch (err) {
      onAddToast('Upload failed.', 'warning');
    }
  };

  const handleSlideSubmit = (e) => {
    e.preventDefault();
    if (!slideForm.image.trim()) {
      onAddToast('Slide image is required.', 'warning');
      return;
    }
    const newSlide = {
      name: slideForm.name.trim(),
      alt: slideForm.alt.trim() || slideForm.name.trim() || 'Hero Slide',
      image: slideForm.image.trim()
    };
    onUpdateHeroSlides([...heroSlides, newSlide]);
    setSlideForm({ name: '', alt: '', image: '' });
    setSlideImagePreview(null);
    onAddToast('New hero slide added!', 'success');
  };

  const handleSaveSlide = () => {
    if (!editingSlide) return;
    if (!editingSlide.image.trim()) {
      onAddToast('Slide image is required.', 'warning');
      return;
    }
    const updated = [...heroSlides];
    updated[editingSlide.index] = {
      name: editingSlide.name.trim(),
      alt: editingSlide.alt.trim() || editingSlide.name.trim() || 'Hero Slide',
      image: editingSlide.image.trim()
    };
    onUpdateHeroSlides(updated);
    setEditingSlide(null);
    onAddToast('Hero slide updated!', 'success');
  };

  const handleDeleteSlide = (index) => {
    const updated = heroSlides.filter((_, i) => i !== index);
    onUpdateHeroSlides(updated);
    onAddToast('Hero slide deleted.', 'warning');
  };

  // ── Analytics ─────────────────────────────────────────────────────────────
  const totalRevenue       = orders.reduce((s, o) => s + (o.total || 0), 0);
  const completedOrders    = useMemo(() => orders.filter(o => o.status === 'Delivered'), [orders]);
  const pendingOrders      = useMemo(() => orders.filter(o => o.status !== 'Delivered'), [orders]);

  const todayKey   = new Date().toISOString().split('T')[0];
  const thisMonth  = new Date().getMonth();
  const thisYear   = new Date().getFullYear();

  const todayRevenue = useMemo(() =>
    orders.filter(o => o.createdAt?.split('T')[0] === todayKey).reduce((s, o) => s + (o.total || 0), 0),
    [orders, todayKey]);

  const monthlyRevenue = useMemo(() =>
    orders.filter(o => {
      if (!o.createdAt) return false;
      const d = new Date(o.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).reduce((s, o) => s + (o.total || 0), 0),
    [orders, thisMonth, thisYear]);

  // ── CSV Download ──────────────────────────────────────────────────────────
  const downloadCSV = () => {
    const headers = [
      'Order ID', 'Customer', 'Mobile', 'City', 'Pin', 'Address',
      'Items', 'Subtotal (₹)', 'Discount (₹)', 'Tax (₹)', 'Shipping (₹)', 'Total (₹)',
      'Payment Method', 'Status', 'Date'
    ];
    const rows = orders.map(o => [
      o.id,
      o.shippingDetails?.name || '',
      o.shippingDetails?.mobile || '',
      o.shippingDetails?.city || '',
      o.shippingDetails?.pincode || '',
      o.shippingDetails?.address || '',
      (o.items || []).map(i => `${i.name || i.product?.name} x${i.quantity}`).join(' | '),
      o.subtotal || '',
      o.discount || '',
      o.tax || '',
      o.shipping || '',
      o.total || '',
      o.paymentDetails?.method || o.paymentMethod || '',
      o.status,
      o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'N/A',
    ]);
    const csv   = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob  = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url   = URL.createObjectURL(blob);
    const link  = Object.assign(document.createElement('a'), {
      href: url, download: `gymmillets-transactions-${new Date().toISOString().split('T')[0]}.csv`
    });
    link.click();
    URL.revokeObjectURL(url);
    onAddToast('Transactions CSV downloaded!', 'success');
  };

  // ── PDF Statement Download (PhonePe-style) ───────────────────────────────────
  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // ─ Header background bar
    doc.setFillColor(42, 74, 22);
    doc.rect(0, 0, pageW, 32, 'F');

    // ─ Brand name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('GymMillets', 14, 13);

    // ─ Tagline
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 230, 180);
    doc.text('Pure Millet Foods • Healthy Living', 14, 19);

    // ─ Statement label (right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('TRANSACTION STATEMENT', pageW - 14, 13, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 230, 180);
    doc.text(`Generated: ${dateStr} at ${timeStr}`, pageW - 14, 19, { align: 'right' });

    // ─ Summary boxes
    const boxY = 38;
    const boxH = 22;
    const boxes = [
      { label: 'Total Orders', value: String(orders.length) },
      { label: 'Total Revenue', value: `INR ${totalRevenue.toLocaleString('en-IN')}` },
      { label: 'Completed', value: String(completedOrders.length) },
      { label: 'Pending', value: String(pendingOrders.length) },
    ];
    const boxW = (pageW - 28) / boxes.length;
    boxes.forEach((b, i) => {
      const bx = 14 + i * boxW;
      doc.setFillColor(i % 2 === 0 ? 245 : 240, i % 2 === 0 ? 249 : 246, i % 2 === 0 ? 235 : 230);
      doc.roundedRect(bx, boxY, boxW - 3, boxH, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(42, 74, 22);
      doc.text(b.value, bx + (boxW - 3) / 2, boxY + 12, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 110, 90);
      doc.text(b.label.toUpperCase(), bx + (boxW - 3) / 2, boxY + 18, { align: 'center' });
    });

    // ─ Section heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(42, 74, 22);
    doc.text('All Transactions', 14, boxY + boxH + 10);
    doc.setDrawColor(42, 74, 22);
    doc.setLineWidth(0.4);
    doc.line(14, boxY + boxH + 12, pageW - 14, boxY + boxH + 12);

    // ─ Table
    const tableRows = orders.map((o, idx) => [
      idx + 1,
      o.id,
      o.shippingDetails?.name || '—',
      o.shippingDetails?.city || '—',
      o.paymentDetails?.method || 'COD',
      `INR ${(o.subtotal || 0).toLocaleString('en-IN')}`,
      o.discount ? `- INR ${o.discount.toLocaleString('en-IN')}` : '—',
      `INR ${(o.total || 0).toLocaleString('en-IN')}`,
      o.status,
      o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—',
    ]);

    autoTable(doc, {
      startY: boxY + boxH + 16,
      head: [['#', 'Order ID', 'Customer', 'City', 'Payment', 'Subtotal', 'Discount', 'Total', 'Status', 'Date']],
      body: tableRows,
      styles: {
        font: 'helvetica',
        fontSize: 7.5,
        cellPadding: 3,
        textColor: [30, 40, 20],
      },
      headStyles: {
        fillColor: [42, 74, 22],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
      },
      alternateRowStyles: { fillColor: [246, 251, 240] },
      columnStyles: {
        0: { cellWidth: 7, halign: 'center' },
        4: { cellWidth: 22 },
        8: { cellWidth: 20, halign: 'center' },
        9: { cellWidth: 20, halign: 'center' },
      },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 8) {
          const status = tableRows[data.row.index]?.[8];
          const colors = {
            Delivered:         [34, 197, 94],
            Placed:            [59, 130, 246],
            Confirmed:         [234, 179,  8],
            Preparing:         [249, 115,  22],
            'Out for Delivery': [168, 85, 247],
          };
          const c = colors[status] || [150, 150, 150];
          doc.setTextColor(...c);
          doc.setFont('helvetica', 'bold');
          doc.text(status || '', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2 + 1, { align: 'center' });
          doc.setTextColor(30, 40, 20);
          doc.setFont('helvetica', 'normal');
          return false;
        }
      },
      margin: { left: 14, right: 14 },
    });

    // ─ Footer
    const finalY = doc.lastAutoTable?.finalY || 200;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 160, 140);
    doc.text('This is an automatically generated statement by GymMillets Admin Panel. Not a legal document.', pageW / 2, finalY + 10, { align: 'center' });
    doc.setFillColor(42, 74, 22);
    doc.rect(0, doc.internal.pageSize.getHeight() - 8, pageW, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text('GymMillets • Pure Millet Foods • Healthy Living', pageW / 2, doc.internal.pageSize.getHeight() - 3, { align: 'center' });

    doc.save(`GymMillets-Statement-${today.toISOString().split('T')[0]}.pdf`);
    onAddToast('PDF Statement downloaded!', 'success');
  };

  // ── Product Handlers ───────────────────────────────────────────────────────
  const resetProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setImagePreview(null);
    setProductForm(emptyProductForm(categories?.[0]?.name));
    // Reset pricing configs to defaults
    setSolidConfig([
      { label: '250g', price: '', enabled: true },
      { label: '500g', price: '', enabled: true },
      { label: '1kg', price: '', enabled: true }
    ]);
    setLiquidConfig([
      { label: '250ML', price: '', enabled: true },
      { label: '500ML', price: '', enabled: true },
      { label: '1LT', price: '', enabled: true }
    ]);
    setPiecesConfig([
      { label: '1 Pc', price: '', enabled: true },
      { label: '2 Pcs', price: '', enabled: true },
      { label: '3 Pcs', price: '', enabled: true }
    ]);
    setPacketConfig([
      { label: '1 Pkt', price: '', enabled: true },
      { label: '2 Pkts', price: '', enabled: true },
      { label: '3 Pkts', price: '', enabled: true }
    ]);
    setPricingTab('solid');
  };

  const loadPricingConfig = (product) => {
    const defaultSolid = [
      { label: '250g', price: '', enabled: true },
      { label: '500g', price: '', enabled: true },
      { label: '1kg', price: '', enabled: true }
    ];
    const defaultLiquid = [
      { label: '250ML', price: '', enabled: true },
      { label: '500ML', price: '', enabled: true },
      { label: '1LT', price: '', enabled: true }
    ];
    const defaultPieces = [
      { label: '1 Pc', price: '', enabled: true },
      { label: '2 Pcs', price: '', enabled: true },
      { label: '3 Pcs', price: '', enabled: true }
    ];
    const defaultPackets = [
      { label: '1 Pkt', price: '', enabled: true },
      { label: '2 Pkts', price: '', enabled: true },
      { label: '3 Pkts', price: '', enabled: true }
    ];

    if (!product || !product.variants || product.variants.length === 0 || typeof product.variants[0] === 'string') {
      const qtyLower = String(product?.quantity || '').toLowerCase().replace(/\s+/g, '');
      let detectedType = 'solid';
      if (qtyLower.includes('ml') || qtyLower.includes('lt') || qtyLower.includes('liter')) {
        detectedType = 'liquid';
      } else if (qtyLower.includes('pc') || qtyLower.includes('piece') || qtyLower.includes('pcs')) {
        detectedType = 'pieces';
      } else if (qtyLower.includes('pkt') || qtyLower.includes('packet') || qtyLower.includes('pkts')) {
        detectedType = 'packets';
      }

      setPricingTab(detectedType);

      if (detectedType === 'solid') {
        let matched = false;
        const newSolid = defaultSolid.map(item => {
          const cleanLabel = item.label.toLowerCase().replace(/\s+/g, '');
          if (qtyLower === cleanLabel) {
            matched = true;
            return { ...item, price: String(product.price), enabled: true };
          }
          return { ...item, price: '', enabled: false };
        });
        if (!matched && product?.quantity) {
          newSolid.push({ label: product.quantity, price: String(product.price), enabled: true, isCustom: true });
        }
        setSolidConfig(newSolid);
        setLiquidConfig(defaultLiquid);
        setPiecesConfig(defaultPieces);
        setPacketConfig(defaultPackets);
      } else if (detectedType === 'liquid') {
        let matched = false;
        const newLiquid = defaultLiquid.map(item => {
          const cleanLabel = item.label.toLowerCase().replace(/\s+/g, '');
          if (qtyLower === cleanLabel) {
            matched = true;
            return { ...item, price: String(product.price), enabled: true };
          }
          return { ...item, price: '', enabled: false };
        });
        if (!matched && product?.quantity) {
          newLiquid.push({ label: product.quantity, price: String(product.price), enabled: true, isCustom: true });
        }
        setLiquidConfig(newLiquid);
        setSolidConfig(defaultSolid);
        setPiecesConfig(defaultPieces);
        setPacketConfig(defaultPackets);
      } else if (detectedType === 'pieces') {
        let matched = false;
        const newPieces = defaultPieces.map(item => {
          const cleanLabel = item.label.toLowerCase().replace(/\s+/g, '');
          if (qtyLower === cleanLabel || qtyLower.replace(/s$/, '') === cleanLabel.replace(/s$/, '')) {
            matched = true;
            return { ...item, price: String(product.price), enabled: true };
          }
          return { ...item, price: '', enabled: false };
        });
        if (!matched && product?.quantity) {
          newPieces.push({ label: product.quantity, price: String(product.price), enabled: true, isCustom: true });
        }
        setPiecesConfig(newPieces);
        setSolidConfig(defaultSolid);
        setLiquidConfig(defaultLiquid);
        setPacketConfig(defaultPackets);
      } else {
        let matched = false;
        const newPackets = defaultPackets.map(item => {
          const cleanLabel = item.label.toLowerCase().replace(/\s+/g, '');
          if (qtyLower === cleanLabel || qtyLower.replace(/s$/, '') === cleanLabel.replace(/s$/, '')) {
            matched = true;
            return { ...item, price: String(product.price), enabled: true };
          }
          return { ...item, price: '', enabled: false };
        });
        if (!matched && product?.quantity) {
          newPackets.push({ label: product.quantity, price: String(product.price), enabled: true, isCustom: true });
        }
        setPacketConfig(newPackets);
        setSolidConfig(defaultSolid);
        setLiquidConfig(defaultLiquid);
        setPiecesConfig(defaultPieces);
      }
      return;
    }

    const firstLabel = String(product.variants[0].label || '').toLowerCase();
    const varsMap = {};
    product.variants.forEach(v => {
      varsMap[v.label] = { label: v.label, price: String(v.price || ''), enabled: true, isCustom: v.isCustom };
    });

    if (firstLabel.endsWith('ml') || firstLabel.endsWith('lt') || firstLabel.includes('liter')) {
      setPricingTab('liquid');
      const merged = defaultLiquid.map(item => {
        if (varsMap[item.label]) {
          const res = varsMap[item.label];
          delete varsMap[item.label];
          return res;
        }
        return { ...item, enabled: false };
      });
      Object.values(varsMap).forEach(val => merged.push(val));
      setLiquidConfig(merged);
      setSolidConfig(defaultSolid);
      setPiecesConfig(defaultPieces);
      setPacketConfig(defaultPackets);
    } else if (firstLabel.includes('pc') || firstLabel.includes('piece')) {
      setPricingTab('pieces');
      const merged = defaultPieces.map(item => {
        if (varsMap[item.label]) {
          const res = varsMap[item.label];
          delete varsMap[item.label];
          return res;
        }
        return { ...item, enabled: false };
      });
      Object.values(varsMap).forEach(val => merged.push(val));
      setPiecesConfig(merged);
      setSolidConfig(defaultSolid);
      setLiquidConfig(defaultLiquid);
      setPacketConfig(defaultPackets);
    } else if (firstLabel.includes('pkt') || firstLabel.includes('packet')) {
      setPricingTab('packets');
      const merged = defaultPackets.map(item => {
        if (varsMap[item.label]) {
          const res = varsMap[item.label];
          delete varsMap[item.label];
          return res;
        }
        return { ...item, enabled: false };
      });
      Object.values(varsMap).forEach(val => merged.push(val));
      setPacketConfig(merged);
      setSolidConfig(defaultSolid);
      setLiquidConfig(defaultLiquid);
      setPiecesConfig(defaultPieces);
    } else {
      setPricingTab('solid');
      const merged = defaultSolid.map(item => {
        if (varsMap[item.label]) {
          const res = varsMap[item.label];
          delete varsMap[item.label];
          return res;
        }
        return { ...item, enabled: false };
      });
      Object.values(varsMap).forEach(val => merged.push(val));
      setSolidConfig(merged);
      setLiquidConfig(defaultLiquid);
      setPiecesConfig(defaultPieces);
      setPacketConfig(defaultPackets);
    }
  };

  const handleConfigChange = (index, field, value) => {
    const update = (prev) => prev.map((item, i) => {
      if (i !== index) return item;
      return { ...item, [field]: value };
    });
    if (pricingTab === 'solid') setSolidConfig(update);
    else if (pricingTab === 'liquid') setLiquidConfig(update);
    else if (pricingTab === 'pieces') setPiecesConfig(update);
    else if (pricingTab === 'packets') setPacketConfig(update);
  };

  const handleAddCustomSize = () => {
    const customItem = { label: '', price: '', enabled: true, isCustom: true };
    if (pricingTab === 'solid') setSolidConfig(prev => [...prev, customItem]);
    else if (pricingTab === 'liquid') setLiquidConfig(prev => [...prev, customItem]);
    else if (pricingTab === 'pieces') setPiecesConfig(prev => [...prev, customItem]);
    else if (pricingTab === 'packets') setPacketConfig(prev => [...prev, customItem]);
  };

  const handleRemoveCustomSize = (index) => {
    if (pricingTab === 'solid') setSolidConfig(prev => prev.filter((_, i) => i !== index));
    else if (pricingTab === 'liquid') setLiquidConfig(prev => prev.filter((_, i) => i !== index));
    else if (pricingTab === 'pieces') setPiecesConfig(prev => prev.filter((_, i) => i !== index));
    else if (pricingTab === 'packets') setPacketConfig(prev => prev.filter((_, i) => i !== index));
  };

  const openAddProduct = () => {
    resetProductModal();
    setShowProductModal(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p);
    setImagePreview(p.image || null);
    setProductForm({
      name: p.name, category: p.category, price: p.price, quantity: p.quantity,
      badge: p.badge || '', description: p.description || '', image: p.image || '',
      protein: p.nutrition?.protein || '10g', fiber: p.nutrition?.fiber || '6g',
      carbs: p.nutrition?.carbs || '60g', fat: p.nutrition?.fat || '1g',
    });
    loadPricingConfig(p);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      onAddToast('Product name is required.', 'warning'); return;
    }

    let activeConfig = [];
    if (pricingTab === 'solid') activeConfig = solidConfig;
    else if (pricingTab === 'liquid') activeConfig = liquidConfig;
    else if (pricingTab === 'pieces') activeConfig = piecesConfig;
    else if (pricingTab === 'packets') activeConfig = packetConfig;

    const enabledVariants = activeConfig
      .filter(item => item.enabled && String(item.price).trim() !== '')
      .map(item => ({
        label: item.label.trim(),
        price: parseInt(item.price),
        isCustom: !!item.isCustom
      }));

    if (enabledVariants.length === 0) {
      onAddToast('Configure at least one enabled size and price.', 'warning');
      return;
    }

    const primaryPrice = enabledVariants[0].price;
    const primaryQty = enabledVariants[0].label;

    const data = {
      name: productForm.name.trim(),
      category: productForm.category,
      price: primaryPrice,
      quantity: primaryQty,
      badge: productForm.badge || 'New',
      description: productForm.description || 'Premium millet product.',
      image: productForm.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop',
      rating: editingProduct?.rating || 4.8,
      reviewsCount: editingProduct?.reviewsCount || 0,
      variants: enabledVariants,
      nutrition: {
        protein: productForm.protein, fiber: productForm.fiber,
        carbs: productForm.carbs, fat: productForm.fat,
      },
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
      onAddToast('Product updated!', 'success');
      if (onDbUpdateProduct) onDbUpdateProduct(editingProduct.id, data).catch(() => {});
    } else {
      const newP = { id: `p-${Date.now()}`, ...data };
      setProducts(prev => [newP, ...prev]);
      onAddToast('Product added to catalog!', 'success');
      if (onDbAddProduct) onDbAddProduct(newP).catch(() => {});
    }
    resetProductModal();
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    onAddToast('Product removed from catalog.', 'warning');
    if (onDbDeleteProduct) onDbDeleteProduct(id).catch(() => {});
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setProductForm(prev => ({ ...prev, image: url }));
      setImagePreview(url);
      onAddToast('Image uploaded to Cloudinary!', 'success');
    } catch {
      onAddToast('Upload failed. Paste a URL instead.', 'warning');
    } finally {
      setImageUploading(false);
    }
  };

  const saveInlineEdit = (productId) => {
    const edit = inlineEdit[productId];
    if (!edit) return;
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const updated = {
        ...p,
        ...(edit.price    !== undefined ? { price:    parseInt(edit.price)    || p.price }    : {}),
        ...(edit.quantity !== undefined ? { quantity: edit.quantity || p.quantity } : {}),
      };
      if (onDbUpdateProduct) onDbUpdateProduct(productId, updated).catch(() => {});
      return updated;
    }));
    setInlineEdit(prev => { const n = { ...prev }; delete n[productId]; return n; });
    onAddToast('Product updated!', 'success');
  };

  // ── Category Handlers ──────────────────────────────────────────────────────
  const handleCatImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCatImageUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setNewCatImage(url);
      onAddToast('Category image uploaded!', 'success');
    } catch {
      onAddToast('Upload failed. Paste a URL instead.', 'warning');
    } finally {
      setCatImageUploading(false);
    }
  };

  const handleAddCategory = () => {
    const name = newCatName.trim();
    if (!name) { onAddToast('Category name cannot be empty.', 'warning'); return; }
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      onAddToast('Category already exists.', 'warning'); return;
    }
    const newCat = {
      name,
      image: newCatImage || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=300'
    };
    onUpdateCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatImage('');
    onAddToast(`Category "${name}" added!`, 'success');
  };

  const handleSaveCategory = () => {
    if (!editingCat) return;
    const oldName = categories[editingCat.index].name;
    const newName = editingCat.value.trim();
    if (!newName) { onAddToast('Category name cannot be empty.', 'warning'); return; }
    const updated = [...categories];
    updated[editingCat.index] = { ...updated[editingCat.index], name: newName };
    onUpdateCategories(updated);
    setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: newName } : p));
    setEditingCat(null);
    onAddToast(`Category renamed to "${newName}"`, 'success');
  };

  const handleDeleteCategory = (index) => {
    const cat = categories[index];
    if (products.some(p => p.category === cat.name)) {
      onAddToast(`"${cat.name}" has products. Move or delete them first.`, 'warning');
      return;
    }
    onUpdateCategories(categories.filter((_, i) => i !== index));
    onAddToast(`Category "${cat.name}" deleted.`, 'warning');
  };

  const handleUpdateCategoryImage = async (index, fileOrUrl) => {
    let url = fileOrUrl;
    if (typeof fileOrUrl !== 'string') {
      onAddToast('Uploading category image...', 'info');
      try {
        url = await uploadImageToCloudinary(fileOrUrl);
      } catch {
        onAddToast('Upload failed.', 'warning');
        return;
      }
    }
    const updated = [...categories];
    updated[index] = { ...updated[index], image: url };
    onUpdateCategories(updated);
    onAddToast('Category image updated!', 'success');
  };

  const handleDeleteCategoryImage = (index) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], image: '' };
    onUpdateCategories(updated);
    onAddToast('Category image removed.', 'warning');
  };

  // ── Order Handlers ─────────────────────────────────────────────────────────
  const handleUpdateStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    onAddToast(`Order ${orderId} → ${status}`, 'success');
    if (onDbUpdateOrderStatus) onDbUpdateOrderStatus(orderId, status).catch(() => {});
  };

  // ── Coupon Handlers ────────────────────────────────────────────────────────
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim() || !newCoupon.discount) {
      onAddToast('Code and discount % required.', 'warning'); return;
    }
    const coupon = {
      code: newCoupon.code.toUpperCase().trim(),
      discount: parseInt(newCoupon.discount),
      minPurchase: parseInt(newCoupon.minPurchase) || 0,
      description: newCoupon.description || `Get ${newCoupon.discount}% off!`,
    };
    setActiveCoupons(prev => [coupon, ...prev]);
    setNewCoupon({ code: '', discount: '', minPurchase: '', description: '' });
    onAddToast('Coupon activated!', 'success');
    if (onDbAddCoupon) onDbAddCoupon(coupon).catch(() => {});
  };

  const handleDeleteCoupon = (code) => {
    setActiveCoupons(prev => prev.filter(c => c.code !== code));
    onAddToast('Coupon deactivated.', 'warning');
    if (onDbDeleteCoupon) onDbDeleteCoupon(code).catch(() => {});
  };

  // ── Derived lists ──────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() =>
    products.filter(p =>
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase())
    ), [products, productSearch]);

  const filteredOrders = useMemo(() =>
    orderFilter === 'All' ? orders : orders.filter(o => o.status === orderFilter),
    [orders, orderFilter]);

  // ── Nav items ──────────────────────────────────────────────────────────────
  const NAV = [
    { id: 'dashboard',    label: 'Dashboard',    Icon: BarChart2 },
    { id: 'products',     label: 'Products',     Icon: ShoppingBag },
    { id: 'categories',   label: 'Categories',   Icon: LayoutGrid },
    { id: 'orders',       label: 'Orders',       Icon: Truck,       badge: pendingOrders.length },
    { id: 'transactions', label: 'Transactions', Icon: RupeeIcon },
    { id: 'hero-slides',  label: 'Hero Slides',  Icon: Image },
  ];



  return (
    <div className="pt-8 pb-16 px-6 sm:px-8 lg:px-12 w-full max-w-none min-h-screen">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-accent/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest bg-primary/15 text-primary dark:bg-success/15 dark:text-success-light px-3 py-1.5 rounded-full">
            GymMillets Admin HQ
          </span>
          <h1 className="text-4xl font-outfit font-black text-textDark dark:text-cream mt-3.5">Admin Dashboard</h1>
          <p className="text-sm text-textLight dark:text-cream/40 mt-1 font-medium">Manage products, orders, revenue and more.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openAddProduct}
            className="px-5 py-3 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold text-sm shadow-premium flex items-center gap-2 scale-100 active:scale-95 transition-all"
          >
            <PlusCircle size={16} /><span>Add Product</span>
          </button>
          <button
            onClick={downloadCSV}
            className="px-5 py-3 rounded-full bg-success/20 hover:bg-success/30 text-success font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <Download size={16} /><span>CSV</span>
          </button>
          <button
            onClick={onAdminLogout}
            className="px-5 py-3 rounded-full border border-accent/25 text-textLight dark:text-cream/50 font-bold text-sm hover:bg-cream/10 dark:hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <LogOut size={15} /><span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── LAYOUT ── */}
      <div className="flex gap-6 items-start">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 sticky top-28">
          <Card className="p-2.5 space-y-1">
            {NAV.map(({ id, label, Icon, badge }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  tab === id
                    ? 'bg-primary dark:bg-success text-cream shadow-premium'
                    : 'text-textDark dark:text-cream/70 hover:bg-primary/10 dark:hover:bg-success/10'
                }`}
              >
                <span className="flex items-center gap-2.5"><Icon size={16} />{label}</span>
                {badge > 0 && (
                  <span className={`text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center ${
                    tab === id ? 'bg-white/20 text-cream' : 'bg-primary/20 text-primary dark:bg-success/20 dark:text-success-light'
                  }`}>{badge}</span>
                )}
              </button>
            ))}
          </Card>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* ══════════════════ DASHBOARD ══════════════════ */}
          {tab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: 'Total Products',  value: products.length,                    Icon: ShoppingBag,  cls: 'text-primary bg-primary/10 dark:text-success-light dark:bg-success/10' },
                  { label: 'Total Orders',    value: orders.length,                      Icon: ClipboardList, cls: 'text-secondary bg-secondary/10' },
                  { label: 'Completed',       value: completedOrders.length,             Icon: CheckCircle,   cls: 'text-green-500 bg-green-500/10' },
                  { label: 'Pending',         value: pendingOrders.length,               Icon: Clock,         cls: 'text-yellow-500 bg-yellow-500/10' },
                  { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString('en-IN')}`,   Icon: TrendingUp,   cls: 'text-purple-500 bg-purple-500/10' },
                  { label: 'Monthly Revenue', value: `₹${monthlyRevenue.toLocaleString('en-IN')}`, Icon: RupeeIcon,   cls: 'text-highlight bg-highlight/10' },
                ].map(({ label, value, Icon, cls }) => (
                  <Card key={label} className="p-5 space-y-3.5 hover:shadow-premium-hover transition-shadow">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${cls}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 leading-tight">{label}</p>
                      <p className="text-2xl font-outfit font-black text-textDark dark:text-cream mt-1">{value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recent Orders */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream">Recent Orders</h3>
                  <button onClick={() => setTab('orders')} className="text-xs font-bold text-primary dark:text-success-light hover:underline">View All →</button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-sm text-textLight dark:text-cream/40 text-center py-8">No orders yet.</p>
                ) : (
                  <div className="divide-y divide-accent/5">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="flex items-center justify-between py-3.5 gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-extrabold text-textDark dark:text-cream">{o.id}</p>
                          <p className="text-xs text-textLight dark:text-cream/40">{o.shippingDetails?.name || 'Customer'}</p>
                        </div>
                        <span className="text-base font-black text-textDark dark:text-cream">₹{o.total}</span>
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${STATUS_COLORS[o.status] || 'bg-accent/20 text-accent border-accent/20'}`}>
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}

          {tab === 'products' && (
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream">
                  Product Catalog <span className="text-sm text-textLight dark:text-cream/40 font-medium">({products.length})</span>
                </h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textLight dark:text-cream/40 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      className="pl-9 pr-4 py-2.5 bg-cream/50 dark:bg-[#252525] border border-accent/20 rounded-xl text-sm font-medium text-textDark dark:text-cream w-full sm:w-56 focus:outline-none"
                    />
                  </div>
                  <button onClick={openAddProduct} className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-cream font-bold text-sm rounded-xl flex items-center gap-1.5 shadow-premium shrink-0 active:scale-95 transition-all">
                    <PlusCircle size={14} /><span>Add New</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-accent/10 text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/35">
                      <th className="pb-3.5 text-left pr-3 w-12">#</th>
                      <th className="pb-3.5 text-left pr-3">Product</th>
                      <th className="pb-3.5 text-left pr-3">Category</th>
                      <th className="pb-3.5 text-left pr-3">Price (₹)</th>
                      <th className="pb-3.5 text-left pr-3">Qty</th>
                      <th className="pb-3.5 text-left pr-3">Rating</th>
                      <th className="pb-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent/5 text-sm">
                    {filteredProducts.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-sm text-textLight dark:text-cream/40">No products match your search.</td></tr>
                    ) : filteredProducts.map((p, idx) => {
                      const edit = inlineEdit[p.id] || {};
                      const isInline = !!inlineEdit[p.id];
                      return (
                        <tr key={p.id} className="hover:bg-cream/5 dark:hover:bg-white/2 group">
                          <td className="py-3.5 pr-3 text-xs text-textLight dark:text-cream/30 font-bold">{idx + 1}</td>
                          <td className="py-3.5 pr-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl overflow-hidden bg-cream dark:bg-cream-dark/10 shrink-0 border border-accent/10">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=60'; }} />
                              </div>
                              <div>
                                <p className="font-extrabold text-textDark dark:text-cream text-sm leading-tight line-clamp-1">{p.name}</p>
                                {p.badge && <span className="text-[10px] font-bold bg-primary/10 text-primary dark:bg-success/10 dark:text-success-light px-2 py-0.5 rounded mt-0.5 inline-block">{p.badge}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className="text-xs font-bold text-textLight dark:text-cream/60">{p.category}</span>
                          </td>
                          <td className="py-3.5 pr-3">
                            {isInline ? (
                              <input
                                type="number"
                                value={edit.price ?? p.price}
                                onChange={e => setInlineEdit(prev => ({ ...prev, [p.id]: { ...prev[p.id], price: e.target.value } }))}
                                className="w-20 bg-cream/50 dark:bg-[#252525] border border-primary/40 rounded-lg px-2 py-1 text-sm font-bold text-textDark dark:text-cream focus:outline-none"
                              />
                            ) : (
                              <button onClick={() => setInlineEdit(prev => ({ ...prev, [p.id]: { price: p.price, quantity: p.quantity } }))}
                                className="font-black text-textDark dark:text-cream text-base hover:text-primary dark:hover:text-success-light transition-colors cursor-pointer" title="Click to edit">
                                ₹{p.price}
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 pr-3">
                            {isInline ? (
                              <input
                                type="text"
                                value={edit.quantity ?? p.quantity}
                                onChange={e => setInlineEdit(prev => ({ ...prev, [p.id]: { ...prev[p.id], quantity: e.target.value } }))}
                                className="w-24 bg-cream/50 dark:bg-[#252525] border border-primary/40 rounded-lg px-2 py-1 text-sm font-bold text-textDark dark:text-cream focus:outline-none"
                              />
                            ) : (
                              <button onClick={() => setInlineEdit(prev => ({ ...prev, [p.id]: { price: p.price, quantity: p.quantity } }))}
                                className="text-sm font-bold text-textDark dark:text-cream/80 hover:text-primary dark:hover:text-success-light cursor-pointer transition-colors" title="Click to edit">
                                {p.quantity}
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className="text-sm font-bold text-yellow-500">★ {p.rating}</span>
                          </td>
                          <td className="py-3.5">
                            <div className="flex items-center gap-1.5 justify-end">
                              {isInline ? (
                                <>
                                  <button onClick={() => saveInlineEdit(p.id)} title="Save" className="p-1.5 bg-success/15 text-success hover:bg-success/25 rounded-lg transition-colors"><Check size={14} /></button>
                                  <button onClick={() => setInlineEdit(prev => { const n = {...prev}; delete n[p.id]; return n; })} title="Cancel" className="p-1.5 bg-accent/15 text-textLight hover:bg-accent/25 rounded-lg transition-colors"><X size={14} /></button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => openEditProduct(p)} title="Edit Product" className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit size={14} /></button>
                                  <button onClick={() => setDeleteConfirm(p.id)} title="Delete Product" className="p-1.5 text-highlight hover:bg-highlight/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ══════════════════ CATEGORIES ══════════════════ */}
          {tab === 'categories' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream mb-4">Add New Category</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                      placeholder="e.g. Protein Bars, Smoothie Mixes..."
                      className={`flex-1 ${inputCls}`}
                    />
                    <button
                      onClick={handleAddCategory}
                      className="px-6 py-3 bg-primary hover:bg-primary-dark text-cream font-bold text-sm rounded-2xl shadow-premium flex items-center gap-1.5 active:scale-95 transition-all shrink-0"
                    >
                      <PlusCircle size={15} /><span>Add Category</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl border border-accent/20 overflow-hidden bg-cream/30 dark:bg-[#252525] shrink-0 flex items-center justify-center relative">
                      {newCatImage ? (
                        <img src={newCatImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageOff size={20} className="text-textLight dark:text-cream/35" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className={`flex items-center gap-2 justify-center w-full py-2.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-xs font-bold ${
                        catImageUploading ? 'border-accent/20 text-textLight dark:text-cream/30 cursor-not-allowed' : 'border-primary/40 hover:border-primary text-primary dark:text-success-light hover:bg-primary/5'
                      }`}>
                        {catImageUploading ? (
                          <><Loader size={13} className="animate-spin" /><span>Uploading Image...</span></>
                        ) : (
                          <><Upload size={13} /><span>Upload Category Image</span></>
                        )}
                        <input type="file" accept="image/*" className="hidden" disabled={catImageUploading} onChange={handleCatImageUpload} />
                      </label>
                      <input
                        type="text"
                        value={newCatImage}
                        onChange={e => setNewCatImage(e.target.value)}
                        placeholder="Or paste category image URL here..."
                        className={`${inputCls} py-2 text-xs`}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream mb-5">
                  All Categories <span className="text-sm text-textLight dark:text-cream/40 font-medium">({categories.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat, idx) => {
                    const count     = products.filter(p => p.category === cat.name).length;
                    const isEditing = editingCat?.index === idx;
                    return (
                      <div key={`${cat.name}-${idx}`} className="flex items-center gap-3 p-4 bg-cream/30 dark:bg-cream-dark/5 rounded-2xl border border-accent/10">
                        {/* Interactive Image Container with Hover Options */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream dark:bg-cream-dark/10 shrink-0 border border-accent/10 relative group/img">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-textLight dark:text-cream/40 font-bold bg-primary/10">🌾</div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-10">
                            <label className="p-1 text-white hover:text-success cursor-pointer" title="Update Image">
                              <Upload size={12} />
                              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpdateCategoryImage(idx, e.target.files[0])} />
                            </label>
                            {cat.image && (
                              <button onClick={() => handleDeleteCategoryImage(idx)} className="p-1 text-white hover:text-highlight" title="Delete Image">
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingCat.value}
                              autoFocus
                              onChange={e => setEditingCat(p => ({ ...p, value: e.target.value }))}
                              onKeyDown={e => e.key === 'Enter' && handleSaveCategory()}
                              className="w-full bg-white dark:bg-darkCard border border-primary/40 rounded-lg px-2 py-1 text-sm font-bold text-textDark dark:text-cream focus:outline-none"
                            />
                          ) : (
                            <>
                              <p className="text-base font-extrabold text-textDark dark:text-cream truncate">{cat.name}</p>
                              <p className="text-xs text-textLight dark:text-cream/40">{count} product{count !== 1 ? 's' : ''}</p>
                            </>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {isEditing ? (
                            <>
                              <button onClick={handleSaveCategory} className="p-1.5 bg-success/20 text-success hover:bg-success/30 rounded-lg transition-colors"><Check size={14} /></button>
                              <button onClick={() => setEditingCat(null)} className="p-1.5 bg-accent/20 text-textLight hover:bg-accent/30 rounded-lg transition-colors"><X size={14} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setEditingCat({ index: idx, value: cat.name })} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit size={14} /></button>
                              <button onClick={() => handleDeleteCategory(idx)} className="p-1.5 text-highlight hover:bg-highlight/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* ══════════════════ ORDERS ══════════════════ */}
          {tab === 'orders' && (
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream">
                  Orders <span className="text-sm text-textLight dark:text-cream/40 font-medium">({filteredOrders.length})</span>
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {['All','Placed','Confirmed','Preparing','Out for Delivery','Delivered'].map(s => (
                    <button
                      key={s}
                      onClick={() => setOrderFilter(s)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black transition-colors ${
                        orderFilter === s ? 'bg-primary dark:bg-success text-cream' : 'bg-cream/50 dark:bg-[#252525] text-textDark dark:text-cream hover:bg-primary/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart size={36} className="mx-auto text-textLight dark:text-cream/20 mb-3" />
                  <p className="text-base text-textLight dark:text-cream/40 font-bold">No orders in this status.</p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-accent/10 text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/35">
                        <th className="pb-3 text-left pr-3">Order ID</th>
                        <th className="pb-3 text-left pr-3">Customer</th>
                        <th className="pb-3 text-left pr-3">Items</th>
                        <th className="pb-3 text-left pr-3">Total</th>
                        <th className="pb-3 text-left pr-3">Date</th>
                        <th className="pb-3 text-left pr-3">Status</th>
                        <th className="pb-3 text-right">Update</th>
                        <th className="pb-3 text-right pr-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/5">
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-cream/5 dark:hover:bg-white/2 text-base">
                          <td className="py-3.5 pr-3 font-extrabold text-textDark dark:text-cream text-sm">{o.id}</td>
                          <td className="py-3.5 pr-3">
                            <p className="font-bold text-textDark dark:text-cream text-sm">{o.shippingDetails?.name || '—'}</p>
                            <p className="text-xs text-textLight dark:text-cream/40">{o.shippingDetails?.mobile}</p>
                          </td>
                          <td className="py-3.5 pr-3 max-w-[150px]">
                            <div className="text-xs text-textLight dark:text-cream/60 space-y-0.5">
                              {(o.items || []).slice(0, 2).map((it, i) => (
                                <div key={i}>{it.name || it.product?.name} ×{it.quantity}</div>
                              ))}
                              {(o.items || []).length > 2 && <div className="text-primary dark:text-success-light font-bold">+{(o.items || []).length - 2} more</div>}
                            </div>
                          </td>
                          <td className="py-3.5 pr-3 font-black text-textDark dark:text-cream text-base">₹{o.total}</td>
                          <td className="py-3.5 pr-3 text-xs text-textLight dark:text-cream/50">
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '—'}
                          </td>
                          <td className="py-3.5 pr-3">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${STATUS_COLORS[o.status] || 'bg-accent/20 text-accent border-accent/20'}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <select
                              value={o.status}
                              onChange={e => handleUpdateStatus(o.id, e.target.value)}
                              className="text-xs font-bold bg-cream/60 dark:bg-[#252525] border border-accent/20 rounded-xl px-2.5 py-2 text-textDark dark:text-cream focus:outline-none cursor-pointer"
                            >
                              {['Placed','Confirmed','Preparing','Out for Delivery','Delivered'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setSelectedViewOrder(o)}
                              className="text-xs font-extrabold bg-primary/10 text-primary dark:bg-success/15 dark:text-success-light hover:bg-primary hover:text-cream dark:hover:bg-success dark:hover:text-cream px-3 py-1.5 rounded-xl transition-all active:scale-95"
                            >
                              View Info
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* ══════════════════ TRANSACTIONS ══════════════════ */}
          {tab === 'transactions' && (
            <div className="space-y-6">
              {/* Revenue cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Revenue All Time', value: `₹${totalRevenue.toLocaleString('en-IN')}`,   Icon: RupeeIcon,   cls: 'text-primary bg-primary/10' },
                  { label: 'This Month Revenue',      value: `₹${monthlyRevenue.toLocaleString('en-IN')}`, Icon: TrendingUp,  cls: 'text-purple-500 bg-purple-500/10' },
                  { label: "Today's Revenue",         value: `₹${todayRevenue.toLocaleString('en-IN')}`,   Icon: ShoppingBag, cls: 'text-success bg-success/10' },
                ].map(({ label, value, Icon, cls }) => (
                  <Card key={label} className="p-6 flex items-center gap-4.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cls}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-textLight dark:text-cream/40">{label}</p>
                      <p className="text-3xl font-outfit font-black text-textDark dark:text-cream mt-0.5">{value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream">
                    All Transactions <span className="text-sm text-textLight dark:text-cream/40 font-medium">({orders.length})</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary dark:bg-success/15 dark:hover:bg-success/25 dark:text-success-light font-black text-sm rounded-xl transition-colors"
                    >
                      <Download size={15} /><span>Download PDF</span>
                    </button>
                    <button
                      onClick={downloadCSV}
                      className="flex items-center gap-2 px-5 py-2.5 bg-success/15 hover:bg-success/25 text-success font-black text-sm rounded-xl transition-colors"
                    >
                      <Download size={15} /><span>CSV</span>
                    </button>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-14">
                    <ClipboardList size={36} className="mx-auto text-textLight dark:text-cream/20 mb-3" />
                    <p className="text-base text-textLight dark:text-cream/40 font-bold">No transactions recorded yet.</p>
                    <p className="text-xs text-textLight dark:text-cream/25 mt-1">Orders placed by customers will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-accent/10 text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/35">
                          <th className="pb-3.5 text-left pr-3">Order ID</th>
                          <th className="pb-3.5 text-left pr-3">Customer</th>
                          <th className="pb-3.5 text-left pr-3">Payment</th>
                          <th className="pb-3.5 text-left pr-3">Subtotal</th>
                          <th className="pb-3.5 text-left pr-3">Total</th>
                          <th className="pb-3.5 text-left pr-3">Status</th>
                          <th className="pb-3.5 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/5 text-sm">
                        {orders.map(o => (
                          <tr key={o.id} className="hover:bg-cream/5 dark:hover:bg-white/2 text-base">
                            <td className="py-3.5 pr-3 font-extrabold text-textDark dark:text-cream text-sm">{o.id}</td>
                            <td className="py-3.5 pr-3">
                              <p className="font-bold text-textDark dark:text-cream text-sm">{o.shippingDetails?.name || '—'}</p>
                              <p className="text-xs text-textLight dark:text-cream/40">{o.shippingDetails?.city}</p>
                            </td>
                            <td className="py-3.5 pr-3 text-sm font-bold text-textDark dark:text-cream">{o.paymentDetails?.method || o.paymentMethod || '—'}</td>
                            <td className="py-3.5 pr-3 text-sm font-bold text-textDark dark:text-cream">₹{o.subtotal || '—'}</td>
                            <td className="py-3.5 pr-3 font-black text-textDark dark:text-cream text-base">₹{o.total}</td>
                            <td className="py-3.5 pr-3">
                              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${STATUS_COLORS[o.status] || 'bg-accent/20 text-accent border-accent/20'}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-xs text-textLight dark:text-cream/50">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ══════════════════ HERO SLIDES ══════════════════ */}
          {tab === 'hero-slides' && (
            <div className="space-y-6">
              {/* Card 1: Add New Slide */}
              <Card className="p-6">
                <h3 className="text-xl font-outfit font-black text-textDark dark:text-cream border-b border-accent/10 pb-4 mb-5">
                  Add New Hero Slide
                </h3>
                <form onSubmit={handleSlideSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 mb-1.5">Millet/Slide Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sorghum (Jowar)"
                        value={slideForm.name}
                        onChange={e => setSlideForm(prev => ({ ...prev, name: e.target.value }))}
                        className={inputCls}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 mb-1.5">Alt Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Sorghum Jowar image"
                        value={slideForm.alt}
                        onChange={e => setSlideForm(prev => ({ ...prev, alt: e.target.value }))}
                        className={inputCls}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Slide Image Upload */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 mb-1.5">Slide Image</label>
                    {slideImagePreview && (
                      <div className="w-40 h-40 rounded-2xl overflow-hidden border border-accent/20 mb-3 bg-cream/30 dark:bg-[#252525]">
                        <img src={slideImagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className={`flex items-center gap-2 justify-center px-4 py-2.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-xs font-bold ${
                        slideImageUploading ? 'border-accent/20 text-textLight dark:text-cream/30 cursor-not-allowed' : 'border-primary/40 hover:border-primary text-primary dark:text-success-light hover:bg-primary/5'
                      }`}>
                        {slideImageUploading ? (
                          <><Loader size={13} className="animate-spin" /><span>Uploading...</span></>
                        ) : (
                          <><Upload size={13} /><span>Upload Slide Image</span></>
                        )}
                        <input type="file" accept="image/*" className="hidden" disabled={slideImageUploading} onChange={handleSlideImageUpload} />
                      </label>
                      <input
                        type="text"
                        placeholder="Or paste slide image URL here..."
                        value={slideForm.image}
                        onChange={e => {
                          setSlideForm(prev => ({ ...prev, image: e.target.value }));
                          setSlideImagePreview(e.target.value);
                        }}
                        className={`flex-1 ${inputCls}`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-cream font-bold text-sm rounded-2xl shadow-premium active:scale-95 transition-all"
                  >
                    Add Slide
                  </button>
                </form>
              </Card>

              {/* Card 2: Existing Slides */}
              <Card className="p-6">
                <h3 className="text-base font-outfit font-black text-textDark dark:text-cream mb-4">
                  Manage Hero Slides <span className="text-sm text-textLight dark:text-cream/40 font-medium">({heroSlides.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {heroSlides.map((slide, idx) => {
                    const isEditing = editingSlide?.index === idx;
                    return (
                      <div key={idx} className="p-4 bg-cream/30 dark:bg-cream-dark/5 rounded-2xl border border-accent/10 flex gap-4 text-base items-center">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream dark:bg-cream-dark/10 shrink-0 border border-accent/10 flex items-center justify-center">
                          {slide.image ? (
                            <img src={slide.image} alt={slide.name || 'Slide'} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-xl">🌾</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          {isEditing ? (
                            <div className="space-y-1.5">
                              <input
                                type="text"
                                value={editingSlide.name}
                                onChange={e => setEditingSlide(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Name"
                                className="w-full bg-white dark:bg-darkCard border border-accent/20 rounded-lg px-2 py-1 text-xs font-bold text-textDark dark:text-cream"
                              />
                              <input
                                type="text"
                                value={editingSlide.alt}
                                onChange={e => setEditingSlide(prev => ({ ...prev, alt: e.target.value }))}
                                placeholder="Alt text"
                                className="w-full bg-white dark:bg-darkCard border border-accent/20 rounded-lg px-2 py-1 text-xs font-bold text-textDark dark:text-cream"
                              />
                              <div className="flex items-center gap-2">
                                <label className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded cursor-pointer font-bold shrink-0">
                                  Upload New
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => e.target.files?.[0] && handleUpdateSlideImage(idx, e.target.files[0])}
                                  />
                                </label>
                                <input
                                  type="text"
                                  value={editingSlide.image}
                                  onChange={e => setEditingSlide(prev => ({ ...prev, image: e.target.value }))}
                                  placeholder="Image URL"
                                  className="flex-1 bg-white dark:bg-darkCard border border-accent/20 rounded-lg px-2 py-1 text-[10px] font-bold text-textDark dark:text-cream"
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="text-base font-extrabold text-textDark dark:text-cream truncate">
                                {slide.name || <span className="text-textLight/40 dark:text-cream/20 italic">(No Name)</span>}
                              </p>
                              <p className="text-xs text-textLight dark:text-cream/40">Alt: {slide.alt || '—'}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5 justify-center shrink-0">
                          {isEditing ? (
                            <>
                              <button onClick={handleSaveSlide} className="p-2 bg-success/20 text-success hover:bg-success/30 rounded-lg transition-colors"><Check size={14} /></button>
                              <button onClick={() => setEditingSlide(null)} className="p-2 bg-accent/20 text-textLight hover:bg-accent/30 rounded-lg transition-colors"><X size={14} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setEditingSlide({ index: idx, name: slide.name, alt: slide.alt, image: slide.image })} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit size={14} /></button>
                              <button onClick={() => handleDeleteSlide(idx)} className="p-2 text-highlight hover:bg-highlight/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

        </main>
      </div>

      {/* ══════════════════ ADD/EDIT PRODUCT MODAL ══════════════════ */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-darkCard border border-accent/25 rounded-3xl shadow-premium p-6 sm:p-8 space-y-5 my-8">
            <button onClick={resetProductModal} className="absolute top-4 right-4 p-2 rounded-full border border-accent/20 text-textLight hover:text-textDark dark:hover:text-cream transition-colors">
              <X size={16} />
            </button>
            <div>
              <h3 className="text-2xl font-outfit font-black text-textDark dark:text-cream">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-xs text-textLight dark:text-cream/40 mt-1">
                {editingProduct ? 'Update the product details below.' : 'Fill in details to add a new product to the catalog.'}
              </p>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 mb-1.5">Product Name *</label>
                  <input type="text" required value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Multi-Millet Dosa Mix" className={inputCls} style={{ width: '100%' }} />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 mb-1.5">Category</label>
                  <select value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                    className={inputCls} style={{ width: '100%' }}>
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 mb-1.5">Badge</label>
                  <input type="text" value={productForm.badge} onChange={e => setProductForm(p => ({ ...p, badge: e.target.value }))}
                    placeholder="Best Seller" className={inputCls} style={{ width: '100%' }} />
                </div>
              </div>

              {/* Pricing & Quantity Config Box */}
              <div className="p-5 border border-accent/20 dark:border-accent/5 rounded-3xl space-y-4 bg-cream/5 dark:bg-[#1c1c1c]/10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 flex items-center gap-1.5">
                    ⚖️ Pricing & Quantity Configuration
                  </span>
                  
                  {/* Tabs */}
                  <div className="flex bg-cream dark:bg-[#252525] p-1 rounded-xl border border-accent/10">
                    {[
                      { id: 'solid', label: 'Solid (Grams/KG)' },
                      { id: 'liquid', label: 'Liquid (ML/Liters)' },
                      { id: 'pieces', label: 'Pieces (Pcs)' },
                      { id: 'packets', label: 'Packets (Pkts)' }
                    ].map(tabItem => (
                      <button
                        key={tabItem.id}
                        type="button"
                        onClick={() => setPricingTab(tabItem.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                          pricingTab === tabItem.id
                            ? 'bg-primary dark:bg-success text-cream shadow-sm'
                            : 'text-textDark dark:text-cream/70 hover:bg-primary/5'
                        }`}
                      >
                        {tabItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Configurations List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <div className="grid grid-cols-12 gap-2 text-[9px] font-extrabold uppercase tracking-wider text-textLight dark:text-cream/35 border-b border-accent/10 pb-1.5">
                    <div className="col-span-2 text-center">Enable</div>
                    <div className="col-span-5">Size / Label</div>
                    <div className="col-span-5">Price (₹)</div>
                  </div>

                  {(pricingTab === 'solid' ? solidConfig : pricingTab === 'liquid' ? liquidConfig : pricingTab === 'pieces' ? piecesConfig : packetConfig).map((item, idx) => (
                    <div key={`${item.label}-${idx}`} className="grid grid-cols-12 gap-2 items-center">
                      {/* Checkbox */}
                      <div className="col-span-2 flex justify-center">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={e => handleConfigChange(idx, 'enabled', e.target.checked)}
                          className="rounded border-accent/30 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                      </div>

                      {/* Size / Label */}
                      <div className="col-span-5">
                        {item.isCustom ? (
                          <input
                            type="text"
                            placeholder="e.g. 5kg"
                            value={item.label}
                            onChange={e => handleConfigChange(idx, 'label', e.target.value)}
                            className="bg-white dark:bg-[#1a1a1a] border border-accent/20 rounded-xl px-2.5 py-1.5 text-xs font-bold text-textDark dark:text-cream w-full focus:outline-none"
                          />
                        ) : (
                          <span className="text-xs font-bold text-textDark dark:text-cream pl-1">{item.label}</span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="col-span-5 flex items-center">
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price}
                          onChange={e => handleConfigChange(idx, 'price', e.target.value)}
                          disabled={!item.enabled}
                          className="bg-white dark:bg-[#1a1a1a] border border-accent/20 rounded-xl px-2.5 py-1.5 text-xs font-bold text-textDark dark:text-cream w-full focus:outline-none disabled:opacity-40"
                        />
                        {item.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomSize(idx)}
                            className="text-highlight hover:bg-highlight/10 p-1.5 rounded-lg transition-colors ml-1.5"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3.5 py-2 border border-accent/20 hover:border-primary text-textDark dark:text-cream font-bold text-[10px] rounded-xl flex items-center gap-1.5 transition-colors hover:bg-primary/5 active:scale-95"
                  >
                    + Add Custom Size
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 mb-1.5">Description</label>
                <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} placeholder="Product description..." className={`${inputCls} resize-none`} style={{ width: '100%' }} />
              </div>

              {/* Image */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40 mb-1.5">Product Image</label>
                {(imagePreview || productForm.image) && (
                  <div className="w-full h-32 rounded-2xl overflow-hidden border border-accent/20 mb-2 bg-cream/30 dark:bg-[#252525]">
                    <img src={imagePreview || productForm.image} alt="Preview" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                  </div>
                )}
                <label className={`flex items-center gap-2 justify-center w-full py-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-xs font-bold mb-2 ${
                  imageUploading ? 'border-accent/20 text-textLight dark:text-cream/30 cursor-not-allowed' : 'border-primary/40 hover:border-primary text-primary dark:text-success-light hover:bg-primary/5'
                }`}>
                  {imageUploading ? (
                    <><Loader size={13} className="animate-spin" /><span>Uploading Image...</span></>
                  ) : (
                    <><Upload size={13} /><span>Upload Image</span></>
                  )}
                  <input type="file" accept="image/*" className="hidden" disabled={imageUploading} onChange={handleImageUpload} />
                </label>
                <input type="text" value={productForm.image}
                  onChange={e => { setProductForm(p => ({ ...p, image: e.target.value })); setImagePreview(e.target.value); }}
                  placeholder="Or paste image URL here..." className={inputCls} style={{ width: '100%' }} />
              </div>




              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={resetProductModal} className="px-6 py-2.5 rounded-full border border-accent/25 text-textDark dark:text-cream font-bold text-xs hover:bg-cream/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold text-xs shadow-premium active:scale-95 transition-all">
                  {editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════ DELETE CONFIRM MODAL ══════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-darkCard border border-accent/25 rounded-3xl p-7 shadow-premium text-center space-y-4">
            <div className="w-14 h-14 mx-auto bg-highlight/10 rounded-2xl flex items-center justify-center">
              <AlertTriangle size={26} className="text-highlight" />
            </div>
            <h3 className="text-lg font-outfit font-black text-textDark dark:text-cream">Delete Product?</h3>
            <p className="text-xs text-textLight dark:text-cream/50">This will permanently remove the product from your catalog. This action cannot be undone.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-full border border-accent/25 text-textDark dark:text-cream font-bold text-xs hover:bg-cream/10 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDeleteProduct(deleteConfirm)} className="flex-1 py-2.5 rounded-full bg-highlight hover:bg-highlight/80 text-white font-bold text-xs transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ VIEW ORDER DETAILS MODAL ══════════════════ */}
      {selectedViewOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-darkCard border border-accent/25 rounded-3xl shadow-premium p-6 sm:p-8 space-y-6 my-8">
            <button onClick={() => setSelectedViewOrder(null)} className="absolute top-4 right-4 p-2 rounded-full border border-accent/20 text-textLight hover:text-textDark dark:hover:text-cream transition-colors">
              <X size={16} />
            </button>
            <div>
              <h3 className="text-2xl font-outfit font-black text-textDark dark:text-cream flex items-center gap-2">
                <span>Order Details:</span>
                <span className="text-primary dark:text-success-light">{selectedViewOrder.id}</span>
              </h3>
              <p className="text-xs text-textLight dark:text-cream/40 mt-1">
                Full delivery parameters and payment authentication references.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shipping Address details */}
              <div className="bg-cream/40 dark:bg-cream-dark/5 border border-accent/10 dark:border-accent/5 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-extrabold text-primary dark:text-success-light uppercase tracking-wider">Delivery Details</h4>
                <p className="text-sm font-bold text-textDark dark:text-cream">{selectedViewOrder.shippingDetails?.name}</p>
                <p className="text-xs text-textLight dark:text-cream/70 leading-relaxed font-semibold">
                  {selectedViewOrder.shippingDetails?.address}, {selectedViewOrder.shippingDetails?.city} - {selectedViewOrder.shippingDetails?.pincode}
                </p>
                <p className="text-xs text-textLight dark:text-cream/60 font-bold">Contact Mobile: +91 {selectedViewOrder.shippingDetails?.mobile}</p>
                {selectedViewOrder.shippingDetails?.alternateMobile && (
                  <p className="text-xs text-textLight dark:text-cream/60 font-bold">Alternate Mobile: +91 {selectedViewOrder.shippingDetails?.alternateMobile}</p>
                )}
                {selectedViewOrder.shippingDetails?.locationUrl && (
                  <p className="text-xs text-primary dark:text-success-light font-bold flex items-center gap-1 mt-2 pt-2 border-t border-accent/10">
                    <span>📍 Google Maps:</span>
                    <a href={selectedViewOrder.shippingDetails.locationUrl} target="_blank" rel="noopener noreferrer" className="underline truncate max-w-[150px]">
                      Open Map Link
                    </a>
                  </p>
                )}
                
                <div className="mt-3 pt-3 border-t border-accent/10 space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-textLight dark:text-cream/40">Courier Tracking Link</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="e.g. https://www.dtdc.in/tracking/..."
                      value={trackingInput}
                      onChange={e => setTrackingInput(e.target.value)}
                      className="flex-grow bg-white dark:bg-[#252525] border border-accent/25 rounded-xl px-3 py-2 text-xs font-semibold text-textDark dark:text-cream focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleSaveTracking}
                      className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-cream font-bold text-xs rounded-xl active:scale-95 transition-all shadow-premium"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-cream/40 dark:bg-cream-dark/5 border border-accent/10 dark:border-accent/5 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-extrabold text-primary dark:text-success-light uppercase tracking-wider">Payment Details</h4>
                <p className="text-sm font-bold text-textDark dark:text-cream uppercase">{selectedViewOrder.paymentDetails?.method || 'Cash on Delivery'}</p>
                <p className="text-xs text-textLight dark:text-cream/70 font-semibold">
                  Status: <span className="font-bold underline uppercase">{selectedViewOrder.status}</span>
                </p>
                {selectedViewOrder.paymentDetails?.orderId && (
                  <p className="text-[10px] text-textLight dark:text-cream/50 truncate" title={selectedViewOrder.paymentDetails.orderId}>
                    Razorpay Order ID: {selectedViewOrder.paymentDetails.orderId}
                  </p>
                )}
                {selectedViewOrder.paymentDetails?.paymentId && (
                  <p className="text-[10px] text-textLight dark:text-cream/50 truncate" title={selectedViewOrder.paymentDetails.paymentId}>
                    Razorpay Payment ID: {selectedViewOrder.paymentDetails.paymentId}
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold text-textDark dark:text-cream uppercase tracking-wider">Items Summary</h4>
              <div className="border border-accent/10 rounded-2xl overflow-hidden bg-white dark:bg-darkCard">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-cream/40 dark:bg-white/2 border-b border-accent/10 text-textLight dark:text-cream/40 font-bold uppercase tracking-wider">
                      <th className="p-3">Product</th>
                      <th className="p-3">Qty</th>
                      <th className="p-3">Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-accent/10 text-textDark dark:text-cream font-medium">
                    {(selectedViewOrder.items || []).map((item, i) => (
                      <tr key={i}>
                        <td className="p-3">
                          <p className="font-bold">{item.name || item.product?.name}</p>
                          {item.variant && <p className="text-[10px] text-primary dark:text-success-light font-bold">Size: {item.variant}</p>}
                        </td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">₹{item.price}</td>
                        <td className="p-3 text-right font-bold">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary calculations */}
            <div className="bg-cream/20 dark:bg-cream-dark/5 p-4 rounded-2xl border border-accent/5 flex justify-between items-center">
              <span className="text-xs font-bold text-textLight dark:text-cream/60">Total Order Amount (incl. tax & shipping):</span>
              <span className="text-xl font-outfit font-black text-textDark dark:text-cream">₹{selectedViewOrder.total}</span>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setSelectedViewOrder(null)}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-cream font-bold text-xs shadow-premium active:scale-95 transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
