/* LUXE — Orders Page */
import Store from '../store.js';
import { formatPrice } from '../utils/helpers.js';
import Router from '../router.js';

export default async function renderOrders() {
  const root = document.getElementById('page-root');
  const user = Store.state.user;

  if (!user) {
    root.innerHTML = `<div class="orders-page"><div class="container"><div class="empty-state"><div class="empty-icon">🔒</div><h3>Please log in</h3><p>Log in to view your orders.</p><a href="/login" data-link class="btn btn-primary">Log In</a></div></div></div>`;
    return;
  }

  root.innerHTML = `<div class="orders-page"><div class="container"><div style="text-align:center;padding:100px 0"><div class="loader-spinner" style="margin:0 auto"></div><p style="margin-top:20px">Loading orders...</p></div></div></div>`;

  let orders = [];
  try {
    const { DB } = await import('../firebase.js');
    orders = await DB.getUserOrders(user.uid);
  } catch (e) {
    console.error('Failed to fetch orders', e);
  }

  if (!orders.length) {
    root.innerHTML = `<div class="orders-page"><div class="container"><div class="empty-state"><div class="empty-icon">📦</div><h3>No orders yet</h3><p>Start shopping to see your orders here.</p><a href="/products" data-link class="btn btn-primary">Shop Now</a></div></div></div>`;
    return;
  }

  const statusColor = { Processing: 'warning', Shipped: 'info', Delivered: 'success' };

  root.innerHTML = `
    <div class="orders-page">
      <div class="container">
        <h1 class="heading-3" style="margin-bottom:var(--space-6)">My Orders</h1>
        ${orders.map((order, idx) => `
          <div class="order-card">
            <div class="order-card-header" data-order="${order.id}">
              <div>
                <strong>Order #${order.id.slice(0, 8)}</strong>
                <span style="color:var(--color-text-muted);font-size:var(--text-sm);margin-left:var(--space-3)">${new Date(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="flex gap-4">
                <span class="badge badge-${statusColor[order.status] || 'accent'}">${order.status}</span>
                <strong>${formatPrice(order.total)}</strong>
              </div>
            </div>
            <div class="order-card-body" id="order-body-${order.id}">
              ${order.items.map(i => `
                <div class="order-item">
                  <div style="width:60px;height:80px;border-radius:var(--radius-sm);overflow:hidden;flex-shrink:0"><img src="${i.images?.[0] || i.image}" alt="${i.title}" style="width:100%;height:100%;object-fit:cover" /></div>
                  <div>
                    <div style="font-weight:var(--font-medium)">${i.title}</div>
                    <div style="font-size:var(--text-sm);color:var(--color-text-muted)">Size: ${i.size} • Qty: ${i.qty}</div>
                    <div style="font-size:var(--text-sm);color:var(--color-accent)">${formatPrice(i.price * i.qty)}</div>
                  </div>
                </div>`).join('')}
              <div style="margin-top:var(--space-4);padding-top:var(--space-3);border-top:1px solid var(--color-border);font-size:var(--text-sm);color:var(--color-text-secondary)">
                <p>📍 ${order.address.name}, ${order.address.address}, ${order.address.city} - ${order.address.pin}</p>
                <p style="margin-top:var(--space-1)">💳 Payment: ${order.paymentId}</p>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;

  // Expandable order details
  document.querySelectorAll('.order-card-header').forEach(h => {
    h.addEventListener('click', () => {
      const body = document.getElementById('order-body-' + h.dataset.order);
      body.classList.toggle('open');
    });
  });
}
