/* LUXE — Checkout Page */
import Store from '../store.js';
import { formatPrice } from '../utils/helpers.js';
import { showToast } from '../components/toast.js';
import Router from '../router.js';

export default function renderCheckout() {
  const root = document.getElementById('page-root');
  const cart = Store.state.cart;
  if (!cart.length) { Router.navigate('/cart'); return; }

  const subtotal = Store.getCartTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  root.innerHTML = `
    <div class="checkout-page">
      <div class="container">
        <h1 class="heading-3" style="margin-bottom:var(--space-6)">Checkout</h1>
        <div class="checkout-layout">
          <div>
            <div class="checkout-section">
              <h3>Shipping Address</h3>
              <div class="form-group"><label>Full Name</label><input type="text" class="form-input" id="ch-name" placeholder="John Doe" /></div>
              <div class="form-group"><label>Phone</label><input type="tel" class="form-input" id="ch-phone" placeholder="9876543210" /></div>
              <div class="form-group"><label>Address</label><textarea class="form-input" id="ch-address" rows="3" placeholder="Street, Apartment, Landmark"></textarea></div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
                <div class="form-group"><label>City</label><input type="text" class="form-input" id="ch-city" placeholder="Mumbai" /></div>
                <div class="form-group"><label>Pincode</label><input type="text" class="form-input" id="ch-pin" placeholder="400001" /></div>
              </div>
              <div class="form-group"><label>State</label><input type="text" class="form-input" id="ch-state" placeholder="Maharashtra" /></div>
            </div>
          </div>
          <div>
            <div class="cart-summary">
              <h3>Order Summary</h3>
              ${cart.map(i => `<div class="cart-summary-row"><span>${i.title} (${i.size}) × ${i.qty}</span><span>${formatPrice(i.price * i.qty)}</span></div>`).join('')}
              <div class="cart-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div class="cart-summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
              <button class="btn btn-primary btn-block btn-lg" style="margin-top:var(--space-5)" id="pay-btn">Pay ${formatPrice(total)}</button>
              <p style="font-size:var(--text-xs);color:var(--color-text-muted);text-align:center;margin-top:var(--space-3)">Secured by Razorpay 🔒</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('pay-btn').addEventListener('click', () => {
    const name = document.getElementById('ch-name').value.trim();
    const phone = document.getElementById('ch-phone').value.trim();
    const address = document.getElementById('ch-address').value.trim();
    if (!name || !phone || !address) { showToast('Please fill all required fields', 'error'); return; }

    // Razorpay integration
    if (typeof Razorpay === 'undefined') {
      showToast('Razorpay SDK not loaded. Simulating payment...', 'info');
      simulateOrder(name, phone, address, total);
      return;
    }
    const options = {
      key: 'rzp_live_hYulURwK7yq2ES', // Replace with your Razorpay key
      amount: total * 100,
      currency: 'INR',
      name: 'LUXE Store',
      description: `Order of ${cart.length} item(s)`,
      handler: async function (response) {
        await saveOrder(name, phone, address, total, response.razorpay_payment_id);
      },
      prefill: { name, contact: phone },
      theme: { color: '#d4a853' }
    };
    try {
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (e) {
      showToast('Payment error. Simulating...', 'info');
      simulateOrder(name, phone, address, total);
    }
  });

  async function simulateOrder(name, phone, address, total) {
    await saveOrder(name, phone, address, total, 'SIM_' + Date.now());
  }

  async function saveOrder(name, phone, address, total, paymentId) {
    const user = Store.state.user;
    if (!user) {
      showToast('You must be logged in to checkout.', 'error');
      return;
    }

    const order = {
      uid: user.uid,
      items: [...cart],
      address: { name, phone, address, city: document.getElementById('ch-city').value, state: document.getElementById('ch-state').value, pin: document.getElementById('ch-pin').value },
      total, paymentId, status: 'Processing', createdAt: new Date().toISOString()
    };

    try {
      const { DB } = await import('../firebase.js');
      await DB.addOrder(order);

      Store.clearCart();
      showToast('Order placed successfully! 🎉', 'success');
      const { updateCartBadge } = await import('../components/navbar.js');
      updateCartBadge();
      Router.navigate('/orders');
    } catch (e) {
      console.error(e);
      showToast('Failed to save order. Please try again.', 'error');
    }
  }
}
