export default function renderFaq() {
  const root = document.getElementById('page-root');
  
  // Minimal FAQ data
  const faqs = [
    { q: "Do you ship internationally?", a: "Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by destination." },
    { q: "How can I track my order?", a: "Once your order has been dispatched, you will receive an email with a tracking link. You can also view the status from your Orders page when logged in." },
    { q: "What is your return policy?", a: "We offer a 30-day return window from the date you receive your items. Products must be unworn with original tags attached." },
    { q: "Can I change or cancel my order?", a: "If your order has not yet been processed for shipping, you may cancel or modify it. Please contact us immediately." },
    { q: "What payment methods do you accept?", a: "We accept Visa, Mastercard, American Express, PayPal, and UPI/Razorpay for domestic transactions." }
  ];

  root.innerHTML = `
    <div class="container" style="padding-top: calc(var(--navbar-height) + var(--space-8)); min-height: 80vh; max-width: 800px; margin: 0 auto;">
      <h1 class="heading-2" style="margin-bottom: var(--space-8); text-align: center;">Frequently Asked Questions</h1>
      
      <div class="faq-list" style="display: flex; flex-direction: column; gap: var(--space-4);">
        ${faqs.map(faq => `
          <div style="border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-4);">
            <h3 style="font-size: var(--text-lg); font-weight: var(--font-medium); margin-bottom: var(--space-2); color: var(--color-text-primary); cursor: pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
              ${faq.q} <span style="float: right; color: var(--color-text-muted); font-size: 14px;">▼</span>
            </h3>
            <p style="color: var(--color-text-secondary); display: none; line-height: var(--leading-relaxed); margin-top: var(--space-3); padding-left: var(--space-2); border-left: 2px solid var(--color-accent);">${faq.a}</p>
          </div>
        `).join('')}
      </div>
      
      <div style="margin-top: var(--space-12); text-align: center; padding: var(--space-6); background: var(--color-bg-surface); border-radius: var(--radius-lg);">
        <h3 style="margin-bottom: var(--space-2);">Still have questions?</h3>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">Our support team is here to help.</p>
        <a href="/contact" data-link class="btn btn-secondary">Contact Us</a>
      </div>
    </div>
  `;
}
