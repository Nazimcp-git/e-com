/* LUXE — Product Card Component */
import { formatPrice, discountPercent, renderStars } from '../utils/helpers.js';

export function productCard(product) {
  const off = discountPercent(product.price, product.discountPrice);
  return `
    <div class="product-card" data-link href="/product/${product.id}">
      <div class="product-card-img">
        <img src="${product.images[0]}" alt="${product.title}" loading="lazy" />
        ${off > 0 ? `<span class="product-card-badge">${off}% OFF</span>` : ''}
        <div class="product-card-overlay">
          <button class="btn btn-sm" onclick="event.stopPropagation();" data-quick-add="${product.id}">View Details</button>
        </div>
      </div>
      <div class="product-card-info">
        <div class="product-card-title">${product.title}</div>
        <div class="product-card-price">
          <span class="current">${formatPrice(product.discountPrice || product.price)}</span>
          ${product.discountPrice ? `<span class="original">${formatPrice(product.price)}</span>` : ''}
          ${off > 0 ? `<span class="off">${off}% off</span>` : ''}
        </div>
        <div class="product-card-rating">${renderStars(product.rating)} <span style="margin-left:4px">(${product.reviews})</span></div>
      </div>
    </div>`;
}

export function productGrid(products) {
  if (!products.length) return '<div class="empty-state"><div class="empty-icon">🔍</div><h3>No products found</h3><p>Try adjusting your filters or search terms.</p></div>';
  return `<div class="products-grid">${products.map(productCard).join('')}</div>`;
}

export function productScroll(products) {
  return `<div class="products-scroll">${products.map(productCard).join('')}</div>`;
}
