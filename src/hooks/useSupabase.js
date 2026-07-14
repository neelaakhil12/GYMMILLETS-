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
  return data.map(rowToProduct);
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

// ─────────────────────────────────────────────
//  ORDERS
// ─────────────────────────────────────────────

export async function dbLoadOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(rowToOrder);
}

export async function dbSaveOrder(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderToRow(order)])
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

// ─────────────────────────────────────────────
//  COUPONS
// ─────────────────────────────────────────────

export async function dbLoadCoupons() {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(rowToCoupon);
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

function rowToOrder(row) {
  return {
    id: row.id,
    items: row.items || [],
    shippingDetails: row.shipping_details || {},
    paymentDetails: row.payment_details || {},
    subtotal: row.subtotal || 0,
    discount: row.discount || 0,
    tax: row.tax || 0,
    shipping: row.shipping || 0,
    total: row.total || 0,
    status: row.status || 'Placed',
    createdAt: row.created_at
  };
}

function orderToRow(o) {
  return {
    id: o.id,
    items: o.items,
    shipping_details: o.shippingDetails,
    payment_details: o.paymentDetails,
    subtotal: o.subtotal || 0,
    discount: o.discount || 0,
    tax: o.tax || 0,
    shipping: o.shipping || 0,
    total: o.total,
    status: o.status
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
