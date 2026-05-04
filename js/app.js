/* ========================================
   LUXE — App Bootstrap & Route Registration
   ======================================== */

import Router from './router.js';
import Store from './store.js';
import { renderNavbar, updateCartBadge } from './components/navbar.js';
import { renderFooter } from './components/footer.js';
import { showToast } from './components/toast.js';
import { PRODUCTS, CATEGORIES, HERO_SLIDES } from '../data/seed.js';

// Initial fallback to prevent empty state before fetch
Store.setProducts(PRODUCTS);
Store.setCategories(CATEGORIES);
Store.setHeroSlides(HERO_SLIDES);

// ─── Register Routes ───
Router.addRoute('/', async () => {
  const { default: renderHome } = await import('./pages/home.js');
  renderHome();
});

Router.addRoute('/products', async () => {
  const { default: renderProducts } = await import('./pages/products.js');
  renderProducts();
});

Router.addRoute('/products/:category', async (params) => {
  const { default: renderProducts } = await import('./pages/products.js');
  renderProducts(params);
});

Router.addRoute('/product/:id', async (params) => {
  const { default: renderProductDetail } = await import('./pages/productDetail.js');
  renderProductDetail(params);
});

Router.addRoute('/cart', async () => {
  const { default: renderCart } = await import('./pages/cart.js');
  renderCart();
});

Router.addRoute('/shipping', async () => {
  const { default: renderShipping } = await import('./pages/shipping.js');
  renderShipping();
});

Router.addRoute('/returns', async () => {
  const { default: renderReturns } = await import('./pages/returns.js');
  renderReturns();
});

Router.addRoute('/privacy', async () => {
  const { default: renderPrivacy } = await import('./pages/privacy.js');
  renderPrivacy();
});

Router.addRoute('/contact', async () => {
  const { default: renderContact } = await import('./pages/contact.js');
  renderContact();
});

Router.addRoute('/faq', async () => {
  const { default: renderFaq } = await import('./pages/faq.js');
  renderFaq();
});

Router.addRoute('/checkout', async () => {
  const { default: renderCheckout } = await import('./pages/checkout.js');
  renderCheckout();
});

Router.addRoute('/login', async () => {
  const { default: renderLogin } = await import('./pages/login.js');
  renderLogin();
});

Router.addRoute('/orders', async () => {
  const { default: renderOrders } = await import('./pages/orders.js');
  renderOrders();
});

Router.addRoute('/profile', async () => {
  const { default: renderProfile } = await import('./pages/profile.js');
  renderProfile();
});

Router.addRoute('/wishlist', async () => {
  const { default: renderWishlist } = await import('./pages/wishlist.js');
  renderWishlist();
});

Router.addRoute('/admin', async () => {
  const { default: renderAdmin } = await import('./pages/admin.js');
  renderAdmin();
});

Router.addRoute('*', () => {
  document.getElementById('page-root').innerHTML = `
    <div class="not-found">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" data-link class="btn btn-primary">Back to Home</a>
    </div>`;
});

// ─── Auth Guard ───
Router.beforeEach((route) => {
  const protectedPaths = ['/checkout', '/orders', '/profile', '/admin'];
  if (protectedPaths.includes(route.path) && !Store.state.user) {
    // Allow orders page even without login (uses localStorage)
    if (route.path === '/orders') return true;
    showToast('Please login to continue', 'info');
    Router.navigate('/login');
    return false;
  }
  return true;
});

// ─── Quick Add to Cart (from product cards) ───
document.addEventListener('click', (e) => {
  const quickAdd = e.target.closest('[data-quick-add]');
  if (quickAdd) {
    e.preventDefault();
    e.stopPropagation();
    const product = PRODUCTS.find(p => p.id === quickAdd.dataset.quickAdd);
    if (product) {
      Store.addToCart(product, product.sizes[0], 1);
      showToast(`${product.title} added to cart!`, 'success');
      updateCartBadge();
    }
  }
});

// ─── Product card click navigation ───
document.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card[data-link]');
  if (card && !e.target.closest('[data-quick-add]')) {
    e.preventDefault();
    Router.navigate(card.getAttribute('href'));
  }
});

// ─── Try Firebase auth listener ───
async function initAuth() {
  try {
    const { Auth, DB } = await import('./firebase.js');
    Auth.onAuthChange(async (user) => {
      if (user) {
        const userData = await DB.getUser(user.uid);
        Store.setUser({
          uid: user.uid, email: user.email,
          name: userData?.name || user.displayName || '',
          isAdmin: userData?.role === 'admin'
        });
      } else {
        Store.setUser(null);
      }
      renderNavbar();
      updateCartBadge();
    });
  } catch (e) {
    // Firebase not configured — run in offline mode
    console.warn('Firebase not configured. Running in offline mode.');
    renderNavbar();
    updateCartBadge();
  }
}

// ─── Fetch Data ───
async function loadAppData() {
  try {
    const { DB } = await import('./firebase.js');
    const products = await DB.getProducts();
    const categoriesDoc = await DB.getContent('categories');
    const heroSlidesDoc = await DB.getContent('hero_slides');
    const saleDoc = await DB.getContent('sale');
    const coupons = await DB.getAllCoupons();

    if (products.length) Store.setProducts(products);
    if (categoriesDoc?.items?.length) Store.setCategories(categoriesDoc.items);
    if (heroSlidesDoc?.items?.length) Store.setHeroSlides(heroSlidesDoc.items);
    if (saleDoc) Store.setSale(saleDoc);
    if (coupons.length) Store.setCoupons(coupons);
  } catch (e) {
    console.warn('Failed to fetch from Firebase, using seed data.', e);
  }
}

// ─── Boot ───
document.addEventListener('DOMContentLoaded', async () => {
  renderNavbar();
  renderFooter();
  Router.init();
  Router.resolve();
  await initAuth();
  await loadAppData();
});
