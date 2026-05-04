/* LUXE — Profile Page */
import Store from '../store.js';
import Router from '../router.js';
import { showToast } from '../components/toast.js';
import { renderNavbar } from '../components/navbar.js';

export default function renderProfile() {
  const root = document.getElementById('page-root');
  const user = Store.state.user;
  if (!user) { Router.navigate('/login'); return; }

  const addresses = JSON.parse(localStorage.getItem('luxe_addresses') || '[]');
  const initials = (user.name || user.email || 'U').charAt(0).toUpperCase();

  root.innerHTML = `
    <div class="profile-page">
      <div class="container">
        <div class="profile-layout">
          <div class="profile-sidebar">
            <div class="profile-avatar">${initials}</div>
            <h3 style="margin-bottom:var(--space-1)">${user.name || 'User'}</h3>
            <p style="font-size:var(--text-sm);color:var(--color-text-muted)">${user.email}</p>
            <div class="divider"></div>
            <a href="/orders" data-link style="display:block;padding:var(--space-2) 0;font-size:var(--text-sm)">📦 My Orders</a>
            <button id="logout-profile-btn" style="display:block;padding:var(--space-2) 0;font-size:var(--text-sm);width:100%;text-align:center;margin-top:var(--space-4);color:var(--color-error)">🚪 Logout</button>
          </div>
          <div class="profile-content">
            <div class="checkout-section">
              <h3>Personal Information</h3>
              <div class="form-group"><label>Full Name</label><input type="text" class="form-input" id="prof-name" value="${user.name || ''}" /></div>
              <div class="form-group"><label>Email</label><input type="email" class="form-input" value="${user.email || ''}" disabled /></div>
              <button class="btn btn-primary" id="save-profile-btn">Save Changes</button>
            </div>
            <div class="checkout-section" style="margin-top:var(--space-6)">
              <h3>Saved Addresses</h3>
              <div id="addresses-list">
                ${addresses.length ? addresses.map((a, i) => `
                  <div class="address-option" style="margin-bottom:var(--space-3)">
                    <div class="flex-between">
                      <div class="name">${a.name}</div>
                      <button class="btn btn-sm btn-danger del-addr" data-idx="${i}">Delete</button>
                    </div>
                    <div class="addr">${a.address}, ${a.city} - ${a.pin}</div>
                    <div class="addr">${a.phone}</div>
                  </div>`).join('') : '<p style="color:var(--color-text-muted);font-size:var(--text-sm)">No saved addresses</p>'}
              </div>
              <div class="divider"></div>
              <h4 style="font-size:var(--text-sm);margin-bottom:var(--space-4)">Add New Address</h4>
              <div class="form-group"><label>Name</label><input type="text" class="form-input" id="addr-name" /></div>
              <div class="form-group"><label>Phone</label><input type="tel" class="form-input" id="addr-phone" /></div>
              <div class="form-group"><label>Address</label><textarea class="form-input" id="addr-address" rows="2"></textarea></div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4)">
                <div class="form-group"><label>City</label><input type="text" class="form-input" id="addr-city" /></div>
                <div class="form-group"><label>Pincode</label><input type="text" class="form-input" id="addr-pin" /></div>
              </div>
              <button class="btn btn-secondary" id="add-addr-btn">Add Address</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  // Save profile
  document.getElementById('save-profile-btn').addEventListener('click', async () => {
    const name = document.getElementById('prof-name').value.trim();
    Store.setUser({ ...user, name });
    try { const { DB } = await import('../firebase.js'); await DB.setUser(user.uid, { name }); } catch (e) {}
    showToast('Profile updated!', 'success');
    renderNavbar();
  });

  // Add address
  document.getElementById('add-addr-btn').addEventListener('click', () => {
    const addr = {
      name: document.getElementById('addr-name').value.trim(),
      phone: document.getElementById('addr-phone').value.trim(),
      address: document.getElementById('addr-address').value.trim(),
      city: document.getElementById('addr-city').value.trim(),
      pin: document.getElementById('addr-pin').value.trim()
    };
    if (!addr.name || !addr.address) { showToast('Name and address required', 'error'); return; }
    addresses.push(addr);
    localStorage.setItem('luxe_addresses', JSON.stringify(addresses));
    showToast('Address added!', 'success');
    renderProfile();
  });

  // Delete address
  document.querySelectorAll('.del-addr').forEach(b => {
    b.addEventListener('click', () => {
      addresses.splice(+b.dataset.idx, 1);
      localStorage.setItem('luxe_addresses', JSON.stringify(addresses));
      showToast('Address deleted', 'info');
      renderProfile();
    });
  });

  // Logout
  document.getElementById('logout-profile-btn').addEventListener('click', async () => {
    try { const { Auth } = await import('../firebase.js'); await Auth.signOut(); } catch (e) {}
    Store.setUser(null);
    renderNavbar();
    Router.navigate('/');
  });
}
