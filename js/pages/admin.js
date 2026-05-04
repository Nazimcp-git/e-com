/* LUXE — Full Admin Panel */
import Store from '../store.js';
import { formatPrice } from '../utils/helpers.js';
import { showToast } from '../components/toast.js';
import { PRODUCTS as SEED_PRODUCTS, CATEGORIES as SEED_CATEGORIES, HERO_SLIDES as SEED_HERO } from '../../data/seed.js';

export default async function renderAdmin() {
  const root = document.getElementById('page-root');
  const user = Store.state.user;

  // Enforce admin role check
  if (!user || !user.isAdmin) {
    root.innerHTML = `<div class="not-found"><h1>403</h1><p>Unauthorized. Admin access only.</p><a href="/" data-link class="btn btn-primary">Go Home</a></div>`;
    return;
  }

  root.innerHTML = `<div class="container" style="padding:100px 0;text-align:center"><div class="loader-spinner" style="margin:0 auto"></div><p>Loading Admin Dashboard...</p></div>`;

  let DB;
  try {
    const fb = await import('../firebase.js');
    DB = fb.DB;
  } catch (e) {
    console.error('Firebase not loaded', e);
    root.innerHTML = `<div class="container" style="padding:100px 0;text-align:center"><h3>Firebase Error</h3><p>Could not load database.</p></div>`;
    return;
  }

  // Fetch fresh data for admin
  let products = await DB.getProducts();
  let orders = await DB.getAllOrders();
  let categoriesDoc = await DB.getContent('categories');
  let heroSlidesDoc = await DB.getContent('hero_slides');
  
  const categories = categoriesDoc?.items || Store.state.categories || SEED_CATEGORIES;
  const heroSlides = heroSlidesDoc?.items || Store.state.heroSlides || SEED_HERO;

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalCustomers = new Set(orders.map(o => o.uid)).size;

  function renderPage() {
    root.innerHTML = `
      <div class="admin-page">
        <div class="container">
          <div class="flex-between" style="margin-bottom:var(--space-6)">
            <h1 class="heading-3">Admin Dashboard</h1>
            <button class="btn btn-secondary btn-sm" id="seed-data-btn">🌱 Seed Initial Data</button>
          </div>
          
          <div class="admin-stats">
            <div class="stat-card"><div class="stat-label">Total Products</div><div class="stat-value">${products.length}</div></div>
            <div class="stat-card"><div class="stat-label">Total Orders</div><div class="stat-value">${orders.length}</div></div>
            <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value text-gradient">${formatPrice(totalRevenue)}</div></div>
            <div class="stat-card"><div class="stat-label">Customers</div><div class="stat-value">${totalCustomers}</div></div>
          </div>
          
          <div class="tabs" id="admin-tabs">
            <button class="tab-btn active" data-tab="products">Products</button>
            <button class="tab-btn" data-tab="orders">Orders</button>
            <button class="tab-btn" data-tab="content">Content (CMS)</button>
            <button class="tab-btn" data-tab="coupons">Coupons</button>
          </div>
          
          <div id="admin-content" style="margin-top:var(--space-5)">
            <!-- Tab content will be rendered here -->
          </div>
        </div>
      </div>
      
      <!-- Product Modal -->
      <div id="product-modal" class="modal-overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center">
        <div style="background:var(--color-surface);padding:var(--space-5);border-radius:var(--radius-md);width:90%;max-width:600px;max-height:90vh;overflow-y:auto">
          <h2 id="modal-title" style="margin-bottom:var(--space-4)">Product</h2>
          <form id="product-form" style="display:flex;flex-direction:column;gap:var(--space-3)">
            <input type="hidden" id="p-id" />
            <div class="form-group"><label>Title</label><input type="text" id="p-title" class="form-input" required /></div>
            <div class="form-group"><label>Description</label><textarea id="p-desc" class="form-input" rows="3" required></textarea></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
              <div class="form-group"><label>Price (₹)</label><input type="number" id="p-price" class="form-input" required /></div>
              <div class="form-group"><label>Discount Price (₹)</label><input type="number" id="p-discount" class="form-input" /></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
              <div class="form-group"><label>Stock</label><input type="number" id="p-stock" class="form-input" required /></div>
              <div class="form-group"><label>Category ID</label><input type="text" id="p-category" class="form-input" required /></div>
            </div>
            <div class="form-group"><label>Images (comma separated URLs)</label><textarea id="p-images" class="form-input" rows="2" required></textarea></div>
            <div class="form-group"><label>Sizes (comma separated)</label><input type="text" id="p-sizes" class="form-input" placeholder="S, M, L, XL" required /></div>
            <div class="form-group"><label>Other Tags (comma separated)</label><input type="text" id="p-tags" class="form-input" placeholder="summer, casual" /></div>
            
            <div style="display:flex;gap:var(--space-4);margin-top:var(--space-2);padding:var(--space-3);background:var(--color-bg-input);border-radius:var(--radius-md)">
              <label style="display:flex;align-items:center;gap:var(--space-2);cursor:pointer;font-weight:600">
                <input type="checkbox" id="p-is-trending" style="width:18px;height:18px;accent-color:var(--color-accent)" /> 🔥 Mark as Trending
              </label>
              <label style="display:flex;align-items:center;gap:var(--space-2);cursor:pointer;font-weight:600">
                <input type="checkbox" id="p-is-new" style="width:18px;height:18px;accent-color:var(--color-accent)" /> ✨ Mark as New Arrival
              </label>
            </div>
            
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4)">
              <button type="submit" class="btn btn-primary" style="flex:1">Save Product</button>
              <button type="button" class="btn btn-secondary" id="close-modal-btn" style="flex:1">Cancel</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Coupon Modal -->
      <div id="coupon-modal" class="modal-overlay" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center">
        <div style="background:var(--color-surface);padding:var(--space-5);border-radius:var(--radius-md);width:90%;max-width:500px;max-height:90vh;overflow-y:auto">
          <h2 id="coupon-modal-title" style="margin-bottom:var(--space-4)">Coupon</h2>
          <form id="coupon-form" style="display:flex;flex-direction:column;gap:var(--space-3)">
            <input type="hidden" id="c-id" />
            <div class="form-group"><label>Code (e.g. LUXE25)</label><input type="text" id="c-code" class="form-input" style="text-transform:uppercase" required /></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
              <div class="form-group"><label>Type</label><select id="c-type" class="form-input"><option value="percent">Percentage (%)</option><option value="flat">Flat Amount (₹)</option></select></div>
              <div class="form-group"><label>Value</label><input type="number" id="c-value" class="form-input" required /></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">
              <div class="form-group"><label>Min Order (₹)</label><input type="number" id="c-min" class="form-input" required /></div>
              <div class="form-group"><label>Max Discount (₹)</label><input type="number" id="c-max" class="form-input" required /></div>
            </div>
            <div class="form-group"><label>Description</label><input type="text" id="c-desc" class="form-input" required /></div>
            
            <div style="display:flex;gap:var(--space-3);margin-top:var(--space-4)">
              <button type="submit" class="btn btn-primary" style="flex:1">Save Coupon</button>
              <button type="button" class="btn btn-secondary" id="close-coupon-modal-btn" style="flex:1">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    `;

    switchTab('products');
    setupEventListeners();
  }

  function setupEventListeners() {
    // Tabs
    document.querySelectorAll('#admin-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        switchTab(e.target.dataset.tab);
      });
    });

    // Seed Data
    document.getElementById('seed-data-btn').addEventListener('click', async () => {
      if (!confirm('This will upload local seed data (Products, Categories, Hero Slides) to Firebase. Proceed?')) return;
      try {
        showToast('Seeding products...', 'info');
        for (const p of SEED_PRODUCTS) {
          const { id, ...data } = p;
          await DB.addProduct(data);
        }
        showToast('Seeding content...', 'info');
        await DB.setContent('categories', { items: SEED_CATEGORIES });
        await DB.setContent('hero_slides', { items: SEED_HERO });
        showToast('Seed complete! Reloading...', 'success');
        products = await DB.getProducts();
        renderPage();
      } catch (e) {
        console.error(e);
        showToast('Seed failed.', 'error');
      }
    });

    // Modal
    document.getElementById('close-modal-btn').addEventListener('click', () => {
      document.getElementById('product-modal').style.display = 'none';
    });

    document.getElementById('product-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('p-id').value;
      const rawTags = document.getElementById('p-tags').value.split(',').map(s => s.trim()).filter(Boolean);
      if (document.getElementById('p-is-trending').checked && !rawTags.includes('trending')) rawTags.push('trending');
      if (document.getElementById('p-is-new').checked && !rawTags.includes('new')) rawTags.push('new');

      const data = {
        title: document.getElementById('p-title').value,
        description: document.getElementById('p-desc').value,
        price: Number(document.getElementById('p-price').value),
        discountPrice: Number(document.getElementById('p-discount').value) || null,
        stock: Number(document.getElementById('p-stock').value),
        category: document.getElementById('p-category').value.toLowerCase(),
        images: document.getElementById('p-images').value.split(',').map(s => s.trim()).filter(Boolean),
        sizes: document.getElementById('p-sizes').value.split(',').map(s => s.trim()).filter(Boolean),
        tags: rawTags,
        rating: 0,
        reviews: 0
      };

      try {
        if (id) {
          // preserve rating/reviews if editing
          const existing = products.find(p => p.id === id);
          if (existing) {
            data.rating = existing.rating;
            data.reviews = existing.reviews;
          }
          await DB.updateProduct(id, data);
          showToast('Product updated!', 'success');
        } else {
          await DB.addProduct(data);
          showToast('Product created!', 'success');
        }
        document.getElementById('product-modal').style.display = 'none';
        products = await DB.getProducts(); // Refresh
        switchTab('products');
      } catch (err) {
        console.error(err);
        showToast('Failed to save product', 'error');
      }
    });

    // Coupon Modal
    document.getElementById('close-coupon-modal-btn').addEventListener('click', () => {
      document.getElementById('coupon-modal').style.display = 'none';
    });

    document.getElementById('coupon-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('c-id').value;
      const data = {
        code: document.getElementById('c-code').value.toUpperCase().trim(),
        type: document.getElementById('c-type').value,
        value: Number(document.getElementById('c-value').value),
        minOrder: Number(document.getElementById('c-min').value),
        maxDiscount: Number(document.getElementById('c-max').value),
        desc: document.getElementById('c-desc').value
      };

      try {
        if (id) {
          await DB.updateCoupon(id, data);
          showToast('Coupon updated!', 'success');
        } else {
          await DB.addCoupon(data);
          showToast('Coupon created!', 'success');
        }
        document.getElementById('coupon-modal').style.display = 'none';
        const freshCoupons = await DB.getAllCoupons();
        Store.setCoupons(freshCoupons);
        switchTab('coupons');
      } catch (err) {
        console.error(err);
        showToast('Failed to save coupon', 'error');
      }
    });
  }

  function switchTab(tab) {
    const content = document.getElementById('admin-content');
    if (tab === 'products') {
      content.innerHTML = `
        <div class="flex-between" style="margin-bottom:var(--space-4)">
          <h2 class="heading-4">Product Management</h2>
          <button class="btn btn-primary btn-sm" id="create-product-btn">+ Create Product</button>
        </div>
        <div class="checkout-section" style="overflow-x:auto">
          <table class="admin-table">
            <thead><tr><th>Image</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Tags</th><th>Actions</th></tr></thead>
            <tbody>
              ${products.map(p => `<tr>
                <td><img src="${p.images?.[0]}" style="width:40px;height:40px;object-fit:cover;border-radius:4px" /></td>
                <td><strong>${p.title}</strong></td>
                <td><span class="badge badge-accent">${p.category}</span></td>
                <td>${formatPrice(p.discountPrice || p.price)}</td>
                <td>${p.stock}</td>
                <td>${p.tags?.join(', ') || '-'}</td>
                <td>
                  <button class="btn-icon edit-product-btn" data-id="${p.id}" style="color:var(--color-info)">✏️</button>
                  <button class="btn-icon delete-product-btn" data-id="${p.id}" style="color:var(--color-error)">🗑️</button>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      `;

      // Create
      document.getElementById('create-product-btn').addEventListener('click', () => {
        document.getElementById('product-form').reset();
        document.getElementById('p-id').value = '';
        document.getElementById('p-is-trending').checked = false;
        document.getElementById('p-is-new').checked = false;
        document.getElementById('modal-title').textContent = 'Create Product';
        document.getElementById('product-modal').style.display = 'flex';
      });

      // Edit
      document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const p = products.find(prod => prod.id === btn.dataset.id);
          if (!p) return;
          document.getElementById('p-id').value = p.id;
          document.getElementById('p-title').value = p.title || '';
          document.getElementById('p-desc').value = p.description || '';
          document.getElementById('p-price').value = p.price || 0;
          document.getElementById('p-discount').value = p.discountPrice || '';
          document.getElementById('p-stock').value = p.stock || 0;
          document.getElementById('p-category').value = p.category || '';
          document.getElementById('p-images').value = (p.images || []).join(', ');
          document.getElementById('p-sizes').value = (p.sizes || []).join(', ');
          const tags = p.tags || [];
          document.getElementById('p-tags').value = tags.filter(t => t !== 'trending' && t !== 'new').join(', ');
          document.getElementById('p-is-trending').checked = tags.includes('trending');
          document.getElementById('p-is-new').checked = tags.includes('new');
          document.getElementById('modal-title').textContent = 'Edit Product';
          document.getElementById('product-modal').style.display = 'flex';
        });
      });

      // Delete
      document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to delete this product?')) {
            try {
              await DB.deleteProduct(btn.dataset.id);
              showToast('Product deleted', 'success');
              products = await DB.getProducts();
              switchTab('products');
            } catch (e) { showToast('Delete failed', 'error'); }
          }
        });
      });

    } else if (tab === 'orders') {
      content.innerHTML = `
        <h2 class="heading-4" style="margin-bottom:var(--space-4)">Order Management</h2>
        ${orders.length ? `
        <div class="checkout-section" style="overflow-x:auto">
          <table class="admin-table">
            <thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th>Update Status</th></tr></thead>
            <tbody>
              ${orders.map(o => `<tr>
                <td>#${o.id.slice(0,8)}</td>
                <td>${new Date(o.createdAt?.toDate ? o.createdAt.toDate() : o.createdAt).toLocaleDateString()}</td>
                <td>${o.address?.name}</td>
                <td>${formatPrice(o.total)}</td>
                <td><span class="badge badge-${o.status === 'Delivered' ? 'success' : o.status === 'Shipped' ? 'info' : 'warning'}">${o.status}</span></td>
                <td>
                  <select class="form-input status-select" data-id="${o.id}" style="padding:4px 8px;font-size:12px;height:auto">
                    <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                    <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  </select>
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>` : '<div class="empty-state">No orders found</div>'}
      `;

      document.querySelectorAll('.status-select').forEach(sel => {
        sel.addEventListener('change', async (e) => {
          try {
            await DB.updateOrderStatus(e.target.dataset.id, e.target.value);
            showToast('Order status updated', 'success');
            orders = await DB.getAllOrders(); // Refresh locally
            // Optional: re-render to update badge color
            switchTab('orders');
          } catch (err) {
            showToast('Failed to update status', 'error');
          }
        });
      });

    } else if (tab === 'content') {
      content.innerHTML = `
        <h2 class="heading-4" style="margin-bottom:var(--space-4)">Content Management (CMS)</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5)">
          <div class="checkout-section">
            <h3>Hero Slider (JSON)</h3>
            <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-2)">Edit the hero slider configuration.</p>
            <textarea id="cms-hero" class="form-input" rows="15" style="font-family:monospace;font-size:12px">${JSON.stringify(heroSlides, null, 2)}</textarea>
            <button class="btn btn-primary" id="save-hero-btn" style="margin-top:var(--space-3)">Save Hero Slides</button>
          </div>
          <div class="checkout-section">
            <h3>Categories (JSON)</h3>
            <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-2)">Edit the homepage categories configuration.</p>
            <textarea id="cms-categories" class="form-input" rows="15" style="font-family:monospace;font-size:12px">${JSON.stringify(categories, null, 2)}</textarea>
            <button class="btn btn-primary" id="save-categories-btn" style="margin-top:var(--space-3)">Save Categories</button>
          </div>
        </div>
        
        <div class="checkout-section" style="margin-top:var(--space-5)">
          <h3>Limited Time Sale</h3>
          <p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-bottom:var(--space-2)">Enable the promotional countdown banner on the homepage.</p>
          <div class="form-group" style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3)">
            <input type="checkbox" id="cms-sale-active" ${Store.state.sale?.active ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--color-accent)" />
            <label for="cms-sale-active" style="margin:0;font-weight:600">Enable Sale Banner</label>
          </div>
          <div class="form-group" style="max-width:300px">
            <label>Sale End Time</label>
            <input type="datetime-local" id="cms-sale-end" class="form-input" value="${Store.state.sale?.endTime ? new Date(Store.state.sale.endTime - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}" />
          </div>
          <button class="btn btn-primary" id="save-sale-btn" style="margin-top:var(--space-3)">Save Sale Settings</button>
        </div>
      `;

      document.getElementById('save-hero-btn').addEventListener('click', async () => {
        try {
          const data = JSON.parse(document.getElementById('cms-hero').value);
          await DB.setContent('hero_slides', { items: data });
          Store.setHeroSlides(data);
          showToast('Hero slides saved successfully', 'success');
        } catch (e) { showToast('Invalid JSON format', 'error'); }
      });

      document.getElementById('save-categories-btn').addEventListener('click', async () => {
        try {
          const data = JSON.parse(document.getElementById('cms-categories').value);
          await DB.setContent('categories', { items: data });
          Store.setCategories(data);
          showToast('Categories saved successfully', 'success');
        } catch (e) { showToast('Invalid JSON format', 'error'); }
      });

      document.getElementById('save-sale-btn').addEventListener('click', async () => {
        try {
          const active = document.getElementById('cms-sale-active').checked;
          const endStr = document.getElementById('cms-sale-end').value;
          const saleConfig = { active, endTime: endStr ? new Date(endStr).getTime() : null };
          
          await DB.setContent('sale', saleConfig);
          Store.setSale(saleConfig);
          showToast('Sale settings saved successfully', 'success');
        } catch (e) {
          console.error(e);
          showToast('Failed to save sale settings', 'error');
        }
      });
    } else if (tab === 'coupons') {
      const coupons = Store.state.coupons || [];
      content.innerHTML = `
        <div class="flex-between" style="margin-bottom:var(--space-4)">
          <h2 class="heading-4">Coupon Management</h2>
          <button class="btn btn-primary btn-sm" id="create-coupon-btn">+ Create Coupon</button>
        </div>
        <div class="checkout-section" style="overflow-x:auto">
          <table class="admin-table">
            <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Max Discount</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              ${coupons.map(c => `<tr>
                <td><strong>${c.code}</strong></td>
                <td><span class="badge badge-info">${c.type}</span></td>
                <td>${c.type === 'percent' ? c.value + '%' : '₹' + c.value}</td>
                <td>₹${c.minOrder}</td>
                <td>₹${c.maxDiscount}</td>
                <td>${c.desc}</td>
                <td>
                  <button class="btn-icon edit-coupon-btn" data-id="${c.id}" style="color:var(--color-info)">✏️</button>
                  <button class="btn-icon delete-coupon-btn" data-id="${c.id}" style="color:var(--color-error)">🗑️</button>
                </td>
              </tr>`).join('')}
              ${coupons.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:var(--space-4)">No coupons found</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      `;

      document.getElementById('create-coupon-btn').addEventListener('click', () => {
        document.getElementById('coupon-form').reset();
        document.getElementById('c-id').value = '';
        document.getElementById('coupon-modal-title').textContent = 'Create Coupon';
        document.getElementById('coupon-modal').style.display = 'flex';
      });

      document.querySelectorAll('.edit-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const c = coupons.find(coup => coup.id === btn.dataset.id);
          if (!c) return;
          document.getElementById('c-id').value = c.id;
          document.getElementById('c-code').value = c.code;
          document.getElementById('c-type').value = c.type;
          document.getElementById('c-value').value = c.value;
          document.getElementById('c-min').value = c.minOrder;
          document.getElementById('c-max').value = c.maxDiscount;
          document.getElementById('c-desc').value = c.desc;
          document.getElementById('coupon-modal-title').textContent = 'Edit Coupon';
          document.getElementById('coupon-modal').style.display = 'flex';
        });
      });

      document.querySelectorAll('.delete-coupon-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to delete this coupon?')) {
            try {
              await DB.deleteCoupon(btn.dataset.id);
              showToast('Coupon deleted', 'success');
              const freshCoupons = await DB.getAllCoupons();
              Store.setCoupons(freshCoupons);
              switchTab('coupons');
            } catch (e) { showToast('Delete failed', 'error'); }
          }
        });
      });
    }
  }

  // Initial render
  renderPage();
}
