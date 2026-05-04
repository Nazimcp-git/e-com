/* LUXE — Loader Component */

export function showLoader() {
  const root = document.getElementById('page-root');
  root.innerHTML = `<div class="page-loader"><div class="loader-spinner"></div><p class="loader-text">Loading...</p></div>`;
}

export function skeletonCards(count = 8) {
  let html = '<div class="products-grid">';
  for (let i = 0; i < count; i++) {
    html += `<div class="product-card"><div class="skeleton" style="aspect-ratio:3/4"></div><div style="padding:var(--space-4)"><div class="skeleton" style="height:16px;margin-bottom:8px"></div><div class="skeleton" style="height:14px;width:60%"></div></div></div>`;
  }
  return html + '</div>';
}
