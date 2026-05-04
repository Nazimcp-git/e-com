/* LUXE — Wishlist Page */
import Store from '../store.js';
import { productGrid } from '../components/productCard.js';

export default function renderWishlist() {
  const root = document.getElementById('page-root');
  const wishlist = Store.state.wishlist;

  if (!wishlist.length) {
    root.innerHTML = `
      <div class="container" style="padding:100px 0;text-align:center">
        <div class="empty-state">
          <div class="empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you like and they will appear here.</p>
          <a href="/products" data-link class="btn btn-primary">Discover Products</a>
        </div>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="container" style="padding:100px 0 40px 0;margin-left:60px">
      <h1 class="heading-3" style="margin-bottom:var(--space-2)">My Wishlist</h1>
      <p style="color:var(--color-text-muted);margin-bottom:var(--space-5)">${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved</p>
      ${productGrid(wishlist)}
    </div>`;
}
