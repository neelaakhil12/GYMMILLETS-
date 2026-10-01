import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────
//  PRODUCTS
// ─────────────────────────────────────────────

export async function dbLoadProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  // Map DB row → app shape
  return (data || []).map(rowToProduct);
}

export async function dbAddProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert([productToRow(product)])
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(data);
}

export async function dbUpdateProduct(id, product) {
  const { data, error } = await supabase
    .from('products')
    .update(productToRow(product))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return rowToProduct(data);
}

export async function dbDeleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export function subscribeToProducts(callback) {
  const channel = supabase
    .channel('realtime:products')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      payload => {
        if (callback) callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ─────────────────────────────────────────────
//  ORDERS
// ─────────────────────────────────────────────

export async function dbLoadOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToOrder);
}

export async function dbSaveOrder(order) {
  const row = orderToRow(order);
  const { data, error } = await supabase
    .from('orders')
    .insert([row])
    .select()
    .single();
  if (error) throw error;
  return rowToOrder(data);
}

export async function dbUpdateOrderStatus(id, status) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function dbUpdateOrderShippingDetails(id, shippingDetails) {
  const { error } = await supabase
    .from('orders')
    .update({ shipping_details: shippingDetails })
    .eq('id', id);
  if (error) throw error;
}

export function subscribeToOrders(callback) {
  const channel = supabase
    .channel('realtime:orders')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      payload => {
        if (callback) callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ─────────────────────────────────────────────
//  COUPONS
// ─────────────────────────────────────────────

export async function dbLoadCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(rowToCoupon);
}

export async function dbAddCoupon(coupon) {
  const { data, error } = await supabase
    .from('coupons')
    .insert([couponToRow(coupon)])
    .select()
    .single();
  if (error) throw error;
  return rowToCoupon(data);
}

export async function dbDeleteCoupon(code) {
  const { error } = await supabase.from('coupons').delete().eq('code', code);
  if (error) throw error;
}

// ─────────────────────────────────────────────
//  ADMIN CONFIG
// ─────────────────────────────────────────────

export async function dbGetAdminPassword() {
  const { data, error } = await supabase
    .from('admin_config')
    .select('value')
    .eq('key', 'password')
    .single();
  if (error) return null;
  return data?.value || null;
}

export async function dbSetAdminPassword(newPassword) {
  const { error } = await supabase
    .from('admin_config')
    .upsert({ key: 'password', value: newPassword });
  if (error) throw error;
}

export async function dbGetStoreSettings() {
  const { data, error } = await supabase
    .from('admin_config')
    .select('value')
    .eq('key', 'store_settings')
    .single();
  if (error || !data?.value) {
    return { deliveryFee: 40, freeDeliveryThreshold: 500, gstPercentage: 5 };
  }
  try {
    const parsed = JSON.parse(data.value);
    return {
      deliveryFee: typeof parsed.deliveryFee === 'number' ? parsed.deliveryFee : 40,
      freeDeliveryThreshold: typeof parsed.freeDeliveryThreshold === 'number' ? parsed.freeDeliveryThreshold : 500,
      gstPercentage: typeof parsed.gstPercentage === 'number' ? parsed.gstPercentage : 5,
    };
  } catch {
    return { deliveryFee: 40, freeDeliveryThreshold: 500, gstPercentage: 5 };
  }
}

export async function dbSaveStoreSettings(settings) {
  const payload = {
    deliveryFee: Number(settings.deliveryFee) || 0,
    freeDeliveryThreshold: Number(settings.freeDeliveryThreshold) || 0,
    gstPercentage: Number(settings.gstPercentage) || 0,
  };
  const { error } = await supabase
    .from('admin_config')
    .upsert({ key: 'store_settings', value: JSON.stringify(payload) });
  if (error) throw error;
  return payload;
}

export async function dbLoadCategories() {
  const { data, error } = await supabase
    .from('admin_config')
    .select('value')
    .eq('key', 'managed_categories')
    .single();
  if (error || !data?.value) {
    return [
      { name: 'Ready Mix', image: '/cat-ready-mix.png' },
      { name: 'Instant Mix', image: '/cat-instant-mix.png' },
      { name: 'Freeze Dried Powders', image: '/cat-powders.png' },
      { name: 'Noodles', image: '/cat-noodles.png' },
      { name: 'Soups', image: '/cat-soups.png' },
      { name: 'Hot Meal', image: '/cat-hot-meals.png' }
    ];
  }
  try {
    const parsed = JSON.parse(data.value);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
  } catch {
    return [];
  }
}

export async function dbSaveCategories(categories) {
  const { error } = await supabase
    .from('admin_config')
    .upsert({ key: 'managed_categories', value: JSON.stringify(categories) });
  if (error) throw error;
  return categories;
}

export async function dbLoadHeroSlides() {
  const { data, error } = await supabase
    .from('admin_config')
    .select('value')
    .eq('key', 'hero_slides')
    .single();
  if (error || !data?.value) {
    return [
      { name: "", image: "/millet-mix.png", alt: "Natural Multi Millet Mix" },
      { name: "Sorghum (Jowar)", image: "/sorghum-jowar.png", alt: "Sorghum Jowar" },
      { name: "Pearl Millet", image: "/pearl-millet.png", alt: "Pearl Millet" },
      { name: "Finger Millet", image: "/finger-millet.png", alt: "Finger Millet" },
      { name: "Foxtail Millet", image: "/foxtail-millet.png", alt: "Foxtail Millet" },
      { name: "Little Millet", image: "/little-millet.png", alt: "Little Millet" }
    ];
  }
  try {
    const parsed = JSON.parse(data.value);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
  } catch {
    return [];
  }
}

export async function dbSaveHeroSlides(slides) {
  const { error } = await supabase
    .from('admin_config')
    .upsert({ key: 'hero_slides', value: JSON.stringify(slides) });
  if (error) throw error;
  return slides;
}

export function subscribeToAdminConfig(callback) {
  const channel = supabase
    .channel('realtime:admin_config')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'admin_config' },
      payload => {
        if (callback) callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ─────────────────────────────────────────────
//  SHAPE CONVERTERS
// ─────────────────────────────────────────────

function rowToProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    quantity: row.quantity,
    badge: row.badge || '',
    description: row.description || '',
    image: row.image,
    rating: row.rating || 4.8,
    reviewsCount: row.reviews_count || 0,
    variants: row.variants || [],
    nutrition: row.nutrition || { protein: '10g', fiber: '6g', carbs: '60g', fat: '1g' }
  };
}

function productToRow(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    quantity: p.quantity,
    badge: p.badge || '',
    description: p.description || '',
    image: p.image,
    rating: p.rating || 4.8,
    reviews_count: p.reviewsCount || 0,
    variants: p.variants || [],
    nutrition: p.nutrition || { protein: '10g', fiber: '6g', carbs: '60g', fat: '1g' }
  };
}

export function rowToOrder(row) {
  const shipping = row.shipping_details || {};
  const payment = row.payment_details || {};
  const userEmail = (
    shipping.userEmail ||
    shipping.email ||
    payment.userEmail ||
    row.user_email ||
    ''
  ).toLowerCase().trim();

  return {
    id: row.id,
    items: row.items || [],
    shippingDetails: {
      ...shipping,
      userEmail: userEmail,
      email: shipping.email || userEmail
    },
    paymentDetails: {
      ...payment,
      userEmail: userEmail
    },
    subtotal: row.subtotal || 0,
    discount: row.discount || 0,
    tax: row.tax || 0,
    shipping: row.shipping || 0,
    total: row.total || 0,
    status: row.status || 'Placed',
    userEmail: userEmail,
    createdAt: row.created_at
  };
}

export function orderToRow(o) {
  const userEmail = (
    o.userEmail ||
    o.shippingDetails?.userEmail ||
    o.shippingDetails?.email ||
    o.paymentDetails?.userEmail ||
    ''
  ).toLowerCase().trim();

  const shippingWithUser = {
    ...(o.shippingDetails || {}),
    userEmail: userEmail,
    email: o.shippingDetails?.email || userEmail
  };

  return {
    id: o.id,
    items: o.items || [],
    shipping_details: shippingWithUser,
    payment_details: {
      ...(o.paymentDetails || {}),
      userEmail: userEmail
    },
    subtotal: o.subtotal || 0,
    discount: o.discount || 0,
    tax: o.tax || 0,
    shipping: o.shipping || 0,
    total: o.total || 0,
    status: o.status || 'Placed'
  };
}

function rowToCoupon(row) {
  return {
    code: row.code,
    discount: row.discount,
    minPurchase: row.min_purchase || 0,
    description: row.description || ''
  };
}

function couponToRow(c) {
  return {
    code: c.code,
    discount: c.discount,
    min_purchase: c.minPurchase || 0,
    description: c.description || ''
  };
}
