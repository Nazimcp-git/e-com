/* LUXE — Navbar Component */
import Store from '../store.js';
import Router from '../router.js';

const SVG = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
};

export function renderNavbar() {
  const nav = document.getElementById('navbar-root');
  const count = Store.getCartCount();
  nav.innerHTML = `
    <div class="navbar" id="main-navbar">
      <div class="navbar-inner">
        <a class="navbar-logo" href="/" data-link><span>LUXE</span></a>
        <nav class="navbar-categories">
          <a href="/products" data-link>All</a>
          <a href="/products/men" data-link>Men</a>
          <a href="/products/women" data-link>Women</a>
          <a href="/products/kids" data-link>Kids</a>
          <a href="/products/accessories" data-link>Accessories</a>
        </nav>
        <div class="navbar-search">
          ${SVG.search}
          <input type="text" placeholder="Search products..." id="nav-search-input" />
        </div>
        <div class="navbar-actions">
          <a href="/cart" data-link class="btn-icon navbar-cart-btn" id="nav-cart-btn">
            ${SVG.cart}
            <span class="cart-badge ${count > 0 ? 'show' : ''}" id="cart-badge">${count}</span>
          </a>
          <div style="position:relative">
            <button class="btn-icon" id="nav-profile-btn">${SVG.user}</button>
            <div class="profile-dropdown" id="profile-dropdown">
              ${Store.state.user ? `
                <a href="/orders" data-link>📦 My Orders</a>
                <a href="/wishlist" data-link>❤️ Wishlist</a>
                <a href="/profile" data-link>👤 Profile</a>
                ${Store.state.user.isAdmin ? '<a href="/admin" data-link>⚙️ Admin</a>' : ''}
                <button id="logout-btn">🚪 Logout</button>
              ` : `
                <a href="/login" data-link>🔑 Login / Sign Up</a>
              `}
            </div>
          </div>
          <button class="hamburger" id="hamburger-btn"><span></span><span></span><span></span></button>
        </div>
      </div>
      <div class="mobile-menu" id="mobile-menu">
        <a href="/" data-link>Home</a>
        <a href="/products" data-link>All Products</a>
        <a href="/products/men" data-link>Men</a>
        <a href="/products/women" data-link>Women</a>
        <a href="/products/kids" data-link>Kids</a>
        <a href="/products/accessories" data-link>Accessories</a>
        <a href="/wishlist" data-link>Wishlist</a>
        <a href="/cart" data-link>Cart (${count})</a>
        ${Store.state.user ? '<a href="/orders" data-link>My Orders</a><a href="/profile" data-link>Profile</a>' : '<a href="/login" data-link>Login</a>'}
      </div>
    </div>`;

  // Scroll effect & home transparency
  const navbar = document.getElementById('main-navbar');
  const path = window.location.pathname;
  if (path === '/') navbar.classList.add('home-transparent');
  
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
  if (window.scrollY > 30) navbar.classList.add('scrolled');

  // Profile dropdown
  const profBtn = document.getElementById('nav-profile-btn');
  const dropdown = document.getElementById('profile-dropdown');
  profBtn.addEventListener('click', () => dropdown.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!profBtn.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.remove('open');
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => { mobileMenu.classList.remove('open'); hamburger.classList.remove('active'); });
  });

  // Search
  const searchInput = document.getElementById('nav-search-input');
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      Router.navigate('/products?q=' + encodeURIComponent(searchInput.value.trim()));
    }
  });

  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const { Auth } = await import('../firebase.js');
        await Auth.signOut();
        Store.setUser(null);
        renderNavbar();
        Router.navigate('/');
      } catch (e) { console.error(e); }
    });
  }

  // Active category highlight
  nav.querySelectorAll('.navbar-categories a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
}

export function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = Store.getCartCount();
  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
}
