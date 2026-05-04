/* LUXE — Coupon System */
import Store from '../store.js';

export function validateCoupon(code, cartTotal) {
  const coupons = Store.state.coupons || [];
  const coupon = coupons.find(c => c.code === code.toUpperCase().trim());
  if (!coupon) return { valid: false, message: 'Invalid coupon code' };
  if (cartTotal < coupon.minOrder) return { valid: false, message: `Minimum order ₹${coupon.minOrder} required` };
  let discount = coupon.type === 'percent' ? Math.round(cartTotal * coupon.value / 100) : coupon.value;
  discount = Math.min(discount, coupon.maxDiscount || Infinity);
  return { valid: true, discount, message: `${coupon.desc} — You save ₹${discount}!`, code: coupon.code };
}

export function getAvailableCoupons() {
  return (Store.state.coupons || []).map(c => ({ code: c.code, desc: c.desc, minOrder: c.minOrder }));
}
