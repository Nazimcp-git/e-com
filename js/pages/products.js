/* LUXE — Products Listing Page */
import { productGrid } from '../components/productCard.js';
import Store from '../store.js';

export default function renderProducts(params = {}) {
  const root = document.getElementById('page-root');
  const urlParams = new URLSearchParams(window.location.search);
  const searchQ = urlParams.get('q') || '';
  
  // Initial filter state
  const state = {
    category: params.category ? [params.category] : [],
    search: searchQ.toLowerCase(),
    minPrice: 0,
    maxPrice: Infinity,
    sizes: [],
    sort: 'default'
  };

  const catTitle = params.category ? params.category.charAt(0).toUpperCase() + params.category.slice(1) : 'All Products';

  root.innerHTML = `
    <div class="products-page">
      <div class="container">
        <div style="padding-top:var(--space-4)">
          <div class="flex-between" style="margin-bottom:var(--space-2)">
            <h1 class="heading-3">${searchQ ? `Results for "${searchQ}"` : catTitle}</h1>
          </div>
          <div class="products-toolbar">
            <span class="result-count" id="result-count">...</span>
            <div class="flex gap-3">
              <button class="btn btn-sm btn-secondary" id="filter-toggle-btn" style="display:none">Filters</button>
              <select class="sort-select" id="sort-select">
                <option value="default">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
        <div class="products-layout">
          <aside class="filter-sidebar" id="filter-sidebar">
            <div class="filter-group">
              <h4>Category</h4>
              ${['men','women','kids','accessories'].map(c =>
                `<label class="filter-option"><input type="checkbox" value="${c}" ${state.category.includes(c) ? 'checked' : ''} class="cat-filter"> ${c.charAt(0).toUpperCase() + c.slice(1)}</label>`
              ).join('')}
            </div>
            <div class="filter-group">
              <h4>Price Range</h4>
              <div class="price-range">
                <input type="number" placeholder="Min" class="form-input" id="price-min" style="height:36px;padding:0 8px;text-align:center">
                <span style="color:var(--color-text-muted)">—</span>
                <input type="number" placeholder="Max" class="form-input" id="price-max" style="height:36px;padding:0 8px;text-align:center">
              </div>
              <button class="btn btn-sm btn-secondary btn-block" style="margin-top:var(--space-3)" id="apply-price">Apply</button>
            </div>
            <div class="filter-group">
              <h4>Size</h4>
              <div class="size-options">
                ${['S','M','L','XL','XXL'].map(s => `<button class="size-btn size-filter" data-size="${s}">${s}</button>`).join('')}
              </div>
            </div>
          </aside>
          <div id="products-container">
            <!-- Products will be rendered here -->
          </div>
        </div>
      </div>
    </div>`;

  function applyFilters() {
    let filtered = [...Store.state.products];
    
    if (state.category.length > 0) {
      filtered = filtered.filter(p => state.category.includes(p.category));
    }
    
    if (state.search) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(state.search) || (p.tags && p.tags.some(t => t.toLowerCase().includes(state.search))));
    }
    
    if (state.sizes.length > 0) {
      filtered = filtered.filter(p => p.sizes && p.sizes.some(s => state.sizes.includes(s)));
    }
    
    filtered = filtered.filter(p => {
      const price = p.discountPrice || p.price || 0;
      return price >= state.minPrice && price <= state.maxPrice;
    });
    
    switch (state.sort) {
      case 'price-low': filtered.sort((a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0)); break;
      case 'price-high': filtered.sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0)); break;
      case 'rating': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'newest': filtered.reverse(); break;
    }
    
    document.getElementById('products-container').innerHTML = productGrid(filtered);
    document.getElementById('result-count').textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
  }

  // Initial render
  applyFilters();

  // Sort listener
  document.getElementById('sort-select').addEventListener('change', (e) => {
    state.sort = e.target.value;
    applyFilters();
  });

  // Price listener
  document.getElementById('apply-price').addEventListener('click', () => {
    const minVal = document.getElementById('price-min').value;
    const maxVal = document.getElementById('price-max').value;
    state.minPrice = minVal ? parseInt(minVal) : 0;
    state.maxPrice = maxVal ? parseInt(maxVal) : Infinity;
    applyFilters();
  });

  // Category listener
  document.querySelectorAll('.cat-filter').forEach(cb => {
    cb.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.category.push(e.target.value);
      } else {
        state.category = state.category.filter(c => c !== e.target.value);
      }
      applyFilters();
    });
  });

  // Size listener
  document.querySelectorAll('.size-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.classList.toggle('active');
      const size = e.target.dataset.size;
      if (e.target.classList.contains('active')) {
        state.sizes.push(size);
      } else {
        state.sizes = state.sizes.filter(s => s !== size);
      }
      applyFilters();
    });
  });

  // Show filter toggle on mobile
  if (window.innerWidth <= 1024) {
    const btn = document.getElementById('filter-toggle-btn');
    btn.style.display = 'inline-flex';
    btn.addEventListener('click', () => {
      document.getElementById('filter-sidebar').classList.toggle('mobile-open');
    });
  }
}
