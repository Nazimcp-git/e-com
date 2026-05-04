/* LUXE — Utility Helpers */

export function formatPrice(n) {
  if (n == null || isNaN(n)) n = 0;
  return '₹' + Number(n).toLocaleString('en-IN');
}

export function discountPercent(original, sale) {
  return Math.round(((original - sale) / original) * 100);
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= Math.floor(rating) ? '★' : (i - 0.5 <= rating ? '★' : '<span class="star-empty">★</span>');
  }
  return `<span class="stars">${html}</span>`;
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

// Lazy load images via IntersectionObserver
export function lazyLoadImages(root = document) {
  const imgs = root.querySelectorAll('img[data-src]');
  if (!imgs.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        e.target.removeAttribute('data-src');
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => obs.observe(img));
}

// Generate a placeholder gradient for missing images
export function placeholderBg(seed = '') {
  const hue = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `linear-gradient(135deg, hsl(${hue},20%,85%) 0%, hsl(${(hue+40)%360},25%,78%) 100%)`;
}
