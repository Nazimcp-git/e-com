/* LUXE — Home Page */
import { renderHeroSlider, initHeroSlider } from '../components/heroSlider.js';
import { productScroll, productGrid, productCard } from '../components/productCard.js';
import Store from '../store.js';

export default function renderHome() {
  const root = document.getElementById('page-root');
  const products = Store.state.products;
  const categories = Store.state.categories;
  const heroSlides = Store.state.heroSlides;

  const trending = products.filter(p => p.tags && p.tags.includes('trending'));
  const newArrivals = products.filter(p => p.tags && p.tags.includes('new'));
  const all = products.slice(0, 8);

  // Categories HTML with real images
  const catsHTML = categories.map(c => {
    return `<a href="/products/${c.id}" data-link class="category-card">
      <img src="${c.image}" alt="${c.name}" loading="lazy" />
      <div class="category-card-overlay"><h3>${c.name}</h3><p>${c.count} Products</p></div>
    </a>`;
  }).join('');

  const sale = Store.state.sale;
  const isSaleActive = sale && sale.active && sale.endTime && new Date(sale.endTime).getTime() > Date.now();

  const saleBannerHTML = isSaleActive ? `
    <section class="section">
      <div class="container">
        <div class="offer-banner" id="offer-banner">
          <div class="offer-content">
            <span class="badge badge-accent">Limited Time</span>
            <h2 style="margin-top:var(--space-3)">End of Season <span class="text-gradient">Sale</span></h2>
            <p>Up to 50% off on premium collections. Don't miss out!</p>
            <a href="/products" data-link class="btn btn-primary">Shop the Sale</a>
          </div>
          <div class="offer-countdown" id="countdown">
            <div class="countdown-item"><span class="num" id="cd-hours">00</span><span class="label">Hours</span></div>
            <div class="countdown-item"><span class="num" id="cd-mins">00</span><span class="label">Minutes</span></div>
            <div class="countdown-item"><span class="num" id="cd-secs">00</span><span class="label">Seconds</span></div>
          </div>
        </div>
      </div>
    </section>` : '';

  root.innerHTML = `
    ${renderHeroSlider(heroSlides)}

    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Shop by <span class="text-gradient">Category</span></h2>
          <p>Find your style across our curated collections</p>
        </div>
        <div class="categories-grid">${catsHTML}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="flex-between" style="margin-bottom:var(--space-8)">
          <h2 class="heading-4">Trending Now 🔥</h2>
          <a href="/products" data-link class="btn btn-secondary btn-sm">View All</a>
        </div>
        <div class="products-grid trending-grid">
          ${(trending.length ? trending : all).slice(0, 3).map(productCard).join('')}
        </div>
      </div>
    </section>

    ${saleBannerHTML}

    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>New <span class="text-gradient">Arrivals</span></h2>
          <p>Fresh styles just landed</p>
        </div>
        ${productGrid(newArrivals.length ? newArrivals : all.slice(0, 4))}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="newsletter">
          <h3>Stay in the <span class="text-gradient">Loop</span></h3>
          <p>Subscribe for exclusive offers, new arrivals, and insider-only discounts.</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button class="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
    </section>`;

  initHeroSlider();

  // Countdown
  if (isSaleActive) {
    const endTimeMs = new Date(sale.endTime).getTime();
    const cdInterval = setInterval(() => {
      const diff = Math.max(0, endTimeMs - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const hEl = document.getElementById('cd-hours');
      const mEl = document.getElementById('cd-mins');
      const sEl = document.getElementById('cd-secs');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
      if (diff <= 0) {
        clearInterval(cdInterval);
        renderHome(); // Re-render to remove banner
      }
    }, 1000);
  }
}
