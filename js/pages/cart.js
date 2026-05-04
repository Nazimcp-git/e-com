/* LUXE — Cart Page */
import Store from '../store.js';
import { formatPrice } from '../utils/helpers.js';
import { validateCoupon, getAvailableCoupons } from '../utils/coupons.js';
import { showToast } from '../components/toast.js';
import { updateCartBadge } from '../components/navbar.js';

let appliedCoupon = null;

function renderCartItems() {
  const cart = Store.state.cart;
  if (!cart.length) {
    return `<div class="empty-state"><div class="empty-icon">🛒</div><h3>Your cart is empty</h3><p>Looks like you haven't added anything yet.</p><a href="/products" data-link class="btn btn-primary">Start Shopping</a></div>`;
  }
  return cart.map(item => `
    <div class="cart-item" data-key="${item.key}">
      <div class="cart-item-img"><img src="${item.image}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover" /></div>
      <div class="cart-item-details">
        <h3>${item.title}</h3>
        <div class="meta">Size: ${item.size}</div>
        <div class="price">${formatPrice(item.price)}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-stepper">
          <button class="cart-qty-dec" data-key="${item.key}">−</button>
          <input type="text" class="qty-val" value="${item.qty}" readonly />
          <button class="cart-qty-inc" data-key="${item.key}">+</button>
        </div>
        <button class="btn btn-sm btn-danger cart-remove" data-key="${item.key}">Remove</button>
      </div>
    </div>`).join('');
}

function renderSummary() {
  const subtotal = Store.getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal + shipping - discount;
  return `
    <h3>Order Summary</h3>
    <div class="cart-summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
    <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
    ${discount > 0 ? `<div class="cart-summary-row" style="color:var(--color-success)"><span>Discount (${appliedCoupon.code})</span><span>-${formatPrice(discount)}</span></div>` : ''}
    <div class="cart-summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
    <div style="margin-top:var(--space-4)">
      <div class="coupon-input" style="margin-top:0;margin-bottom:var(--space-3)">
        <input type="text" placeholder="Coupon code" id="cart-coupon" class="form-input" style="height:40px" />
        <button class="btn btn-sm btn-secondary" id="cart-apply-coupon">Apply</button>
      </div>
      <div id="cart-coupon-msg" style="font-size:var(--text-xs);margin-bottom:var(--space-4)"></div>
      <a href="/checkout" data-link class="btn btn-primary btn-block btn-lg">Proceed to Checkout</a>
    </div>
    <div style="margin-top:var(--space-4);font-size:var(--text-xs);color:var(--color-text-muted);text-align:center">
      ${getAvailableCoupons().map(c => `<div style="margin-top:4px">💡 <strong>${c.code}</strong> — ${c.desc}</div>`).join('')}
    </div>`;
}

export default function renderCart() {
  const root = document.getElementById('page-root');
  appliedCoupon = null;

  function render() {
    const cart = Store.state.cart;
    root.innerHTML = `
      <div class="cart-page">
        <div class="container">
          <h1 class="heading-3" style="margin-bottom:var(--space-6)">Shopping Cart <span style="color:var(--color-text-muted);font-size:var(--text-lg)">(${Store.getCartCount()} items)</span></h1>
          ${cart.length ? `<div class="cart-layout"><div class="cart-items">${renderCartItems()}</div><div class="cart-summary">${renderSummary()}</div></div>` : renderCartItems()}
        </div>
      </div>`;
    bindEvents();
  }

  function bindEvents() {
    document.querySelectorAll('.cart-qty-dec').forEach(b => b.addEventListener('click', () => { const item = Store.state.cart.find(i => i.key === b.dataset.key); if (item && item.qty > 1) { Store.updateQty(b.dataset.key, item.qty - 1); render(); updateCartBadge(); } }));
    document.querySelectorAll('.cart-qty-inc').forEach(b => b.addEventListener('click', () => { const item = Store.state.cart.find(i => i.key === b.dataset.key); if (item) { Store.updateQty(b.dataset.key, item.qty + 1); render(); updateCartBadge(); } }));
    document.querySelectorAll('.cart-remove').forEach(b => b.addEventListener('click', () => { Store.removeFromCart(b.dataset.key); showToast('Item removed from cart', 'info'); render(); updateCartBadge(); }));
    const couponBtn = document.getElementById('cart-apply-coupon');
    if (couponBtn) {
      couponBtn.addEventListener('click', () => {
        const code = document.getElementById('cart-coupon').value;
        const result = validateCoupon(code, Store.getCartTotal());
        const msg = document.getElementById('cart-coupon-msg');
        if (result.valid) { appliedCoupon = result; msg.style.color = 'var(--color-success)'; } else { appliedCoupon = null; msg.style.color = 'var(--color-error)'; }
        msg.textContent = result.message;
        render();
      });
    }
  }

  render();
}
