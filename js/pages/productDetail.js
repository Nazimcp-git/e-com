/* LUXE — Product Detail Page */
import { formatPrice, discountPercent, renderStars } from '../utils/helpers.js';
import { productScroll } from '../components/productCard.js';
import { validateCoupon } from '../utils/coupons.js';
import Store from '../store.js';
import { showToast } from '../components/toast.js';

export default async function renderProductDetail(params) {
  const root = document.getElementById('page-root');
  const product = Store.state.products.find(p => p.id === params.id);
  
  if (!product) {
    root.innerHTML = '<div class="not-found"><h1>404</h1><p>Product not found</p><a href="/" data-link class="btn btn-primary">Go Home</a></div>';
    return;
  }

  const off = discountPercent(product.price, product.discountPrice);
  const related = Store.state.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);

  // Fetch reviews and verify purchase
  let reviews = [];
  let hasPurchased = false;
  try {
    const { DB } = await import('../firebase.js');
    reviews = await DB.getReviews(product.id);
    if (Store.state.user) {
      const userOrders = await DB.getUserOrders(Store.state.user.uid);
      hasPurchased = userOrders.some(order => 
        order.items && order.items.some(item => item.id === product.id)
      );
    }
  } catch(e) { console.error('Failed to load reviews or verify purchase', e); }

  root.innerHTML = `
    <div class="product-detail">
      <div class="container">
        <div class="product-detail-grid">
          <div class="product-gallery">
            <div class="product-gallery-main">
              <img src="${product.images[0]}" alt="${product.title}" id="main-product-img" />
            </div>
            ${product.images.length > 1 ? `
            <div class="product-gallery-thumbs">
              ${product.images.map((img, i) => `
                <div class="product-thumb ${i === 0 ? 'active' : ''}" data-img="${img}">
                  <img src="${img}" alt="${product.title} view ${i+1}" />
                </div>`).join('')}
            </div>` : ''}
          </div>
          <div class="product-info">
            <div class="breadcrumb">
              <a href="/" data-link>Home</a> › <a href="/products/${product.category}" data-link>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</a> › ${product.title}
            </div>
            <h1>${product.title}</h1>
            <div style="margin:var(--space-2) 0">${renderStars(product.rating)} <span style="color:var(--color-text-muted);font-size:var(--text-sm);margin-left:8px">(${product.reviews} reviews)</span></div>
            <div class="price-block">
              <span class="price-current">${formatPrice(product.discountPrice || product.price)}</span>
              ${product.discountPrice ? `<span class="price-original">${formatPrice(product.price)}</span>` : ''}
              ${off > 0 ? `<span class="price-discount">${off}% off</span>` : ''}
            </div>
            <p class="description">${product.description}</p>
            <div class="availability">
              <span class="dot ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}"></span>
              <span>${product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}</span>
            </div>
            <div class="info-label">Select Size</div>
            <div class="size-options" id="size-options">
              ${product.sizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
            </div>
            <div style="margin-top:var(--space-4)">
              <div class="info-label">Quantity</div>
              <div class="qty-stepper">
                <button id="qty-dec">−</button>
                <input type="text" class="qty-val" id="qty-val" value="1" readonly />
                <button id="qty-inc">+</button>
              </div>
            </div>
            <div class="product-actions">
              <button class="btn btn-primary btn-lg" id="add-to-cart-btn" ${product.stock <= 0 ? 'disabled' : ''}>
                Add to Cart
              </button>
              <button class="btn ${Store.isInWishlist(product.id) ? 'btn-primary' : 'btn-secondary'} btn-lg" id="wishlist-btn">
                ${Store.isInWishlist(product.id) ? '❤️ Wishlisted' : '♡ Wishlist'}
              </button>
            </div>
            <div class="coupon-input">
              <input type="text" placeholder="Coupon code" id="coupon-input" class="form-input" style="height:44px" />
              <button class="btn btn-secondary btn-sm" id="apply-coupon-btn">Apply</button>
            </div>
            <div id="coupon-msg" style="margin-top:var(--space-2);font-size:var(--text-sm)"></div>
          </div>
        </div>

        <section class="section" style="margin-top:var(--space-6); border-top:1px solid var(--color-border); padding-top:var(--space-6)">
          <div class="section-header"><h2>Customer <span class="text-gradient">Reviews</span></h2></div>
          <div class="reviews-container">
            ${Store.state.user ? (hasPurchased ? `
              <div class="review-form-box" style="background:var(--color-surface); padding:var(--space-4); border-radius:var(--radius-md); margin-bottom:var(--space-5)">
                <h4 style="margin-bottom:var(--space-2)">Write a Review</h4>
                <div class="form-group">
                  <label>Rating (1-5)</label>
                  <select id="review-rating" class="form-input" style="max-width:100px">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Review</label>
                  <textarea id="review-text" class="form-input" rows="3" placeholder="What did you think about this product?"></textarea>
                </div>
                <button class="btn btn-primary" id="submit-review-btn">Submit Review</button>
              </div>
            ` : `
              <div style="margin-bottom:var(--space-5); padding:var(--space-4); background:var(--color-surface); border-radius:var(--radius-md); text-align:center">
                <p style="color:var(--color-text-secondary)">Only customers who have purchased this product can write a review.</p>
              </div>
            `) : `
              <div style="margin-bottom:var(--space-5); padding:var(--space-4); background:var(--color-surface); border-radius:var(--radius-md); text-align:center">
                <p>Please log in to write a review.</p>
                <a href="/login" data-link class="btn btn-secondary btn-sm" style="margin-top:var(--space-2)">Log In</a>
              </div>
            `}

            <div class="reviews-list">
              ${reviews.length ? reviews.map(r => `
                <div class="review-item" style="border-bottom:1px solid var(--color-border); padding-bottom:var(--space-4); margin-bottom:var(--space-4)">
                  <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-2)">
                    <strong>${r.userName}</strong>
                    <span style="color:var(--color-text-muted); font-size:var(--text-sm)">${new Date(r.createdAt?.toDate ? r.createdAt.toDate() : Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div style="margin-bottom:var(--space-2)">${renderStars(r.rating)}</div>
                  <p style="color:var(--color-text-secondary)">${r.text}</p>
                </div>
              `).join('') : '<p style="color:var(--color-text-muted)">No reviews yet. Be the first to review!</p>'}
            </div>
          </div>
        </section>

        ${related.length ? `
        <section class="section">
          <div class="section-header"><h2>You May Also <span class="text-gradient">Like</span></h2></div>
          ${productScroll(related)}
        </section>` : ''}
      </div>
    </div>`;

  // Thumbnail gallery switching
  document.querySelectorAll('.product-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.product-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      document.getElementById('main-product-img').src = thumb.dataset.img;
    });
  });

  // Size selector
  let selectedSize = product.sizes[0];
  document.getElementById('size-options').addEventListener('click', (e) => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    document.querySelectorAll('#size-options .size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = btn.dataset.size;
  });

  // Quantity
  let qty = 1;
  document.getElementById('qty-dec').addEventListener('click', () => { if (qty > 1) { qty--; document.getElementById('qty-val').value = qty; } });
  document.getElementById('qty-inc').addEventListener('click', () => { if (qty < product.stock) { qty++; document.getElementById('qty-val').value = qty; } });

  // Add to cart
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    Store.addToCart(product, selectedSize, qty);
    showToast(`${product.title} (${selectedSize}) added to cart!`, 'success');
    import('../components/navbar.js').then(m => m.updateCartBadge());
  });

  // Wishlist
  const wishlistBtn = document.getElementById('wishlist-btn');
  wishlistBtn.addEventListener('click', () => {
    Store.toggleWishlist(product);
    const inWishlist = Store.isInWishlist(product.id);
    wishlistBtn.innerHTML = inWishlist ? '❤️ Wishlisted' : '♡ Wishlist';
    if (inWishlist) {
      wishlistBtn.classList.remove('btn-secondary');
      wishlistBtn.classList.add('btn-primary');
    } else {
      wishlistBtn.classList.remove('btn-primary');
      wishlistBtn.classList.add('btn-secondary');
    }
    showToast(inWishlist ? 'Added to Wishlist' : 'Removed from Wishlist', 'success');
  });

  // Coupon
  document.getElementById('apply-coupon-btn').addEventListener('click', () => {
    const code = document.getElementById('coupon-input').value;
    const result = validateCoupon(code, product.discountPrice || product.price);
    const msgEl = document.getElementById('coupon-msg');
    msgEl.style.color = result.valid ? 'var(--color-success)' : 'var(--color-error)';
    msgEl.textContent = result.message;
  });

  // Review Submit
  const submitReviewBtn = document.getElementById('submit-review-btn');
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', async () => {
      const rating = parseInt(document.getElementById('review-rating').value, 10);
      const text = document.getElementById('review-text').value.trim();
      if (!text) {
        showToast('Please enter a review text', 'error');
        return;
      }

      submitReviewBtn.disabled = true;
      submitReviewBtn.textContent = 'Submitting...';

      try {
        const { DB } = await import('../firebase.js');
        await DB.addReview(product.id, {
          rating,
          text,
          userId: Store.state.user.uid,
          userName: Store.state.user.name || Store.state.user.email.split('@')[0]
        });
        
        // Recalculate average rating locally and update product in Firestore
        const newReviews = await DB.getReviews(product.id);
        const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        await DB.updateProduct(product.id, { rating: parseFloat(avgRating.toFixed(1)), reviews: newReviews.length });
        
        showToast('Review submitted successfully!', 'success');
        // Reload page to show new review
        renderProductDetail(params);
      } catch (e) {
        console.error('Error submitting review', e);
        showToast('Failed to submit review', 'error');
        submitReviewBtn.disabled = false;
        submitReviewBtn.textContent = 'Submit Review';
      }
    });
  }
}
