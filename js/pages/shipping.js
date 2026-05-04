export default function renderShipping() {
  const root = document.getElementById('page-root');
  root.innerHTML = `
    <div class="container" style="padding-top: calc(var(--navbar-height) + var(--space-8)); min-height: 80vh; max-width: 800px; margin: 0 auto;">
      <h1 class="heading-2" style="margin-bottom: var(--space-6);">Shipping Information</h1>
      <div class="content-body" style="color: var(--color-text-secondary); line-height: var(--leading-relaxed);">
        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Standard Shipping</h3>
        <p>We offer standard shipping to most locations worldwide. Standard shipping usually takes 5-7 business days for domestic orders and 10-15 business days for international orders.</p>
        
        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Express Shipping</h3>
        <p>Need it faster? Choose express shipping at checkout for delivery within 2-3 business days (domestic only). Additional charges apply.</p>
        
        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Order Tracking</h3>
        <p>Once your order has shipped, you will receive a confirmation email containing a tracking number and a link to track your package's progress.</p>
        
        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">International Customs & Duties</h3>
        <p>Please note that international orders may be subject to customs duties and taxes upon arrival in the destination country. LUXE is not responsible for these additional charges.</p>
      </div>
    </div>
  `;
}
