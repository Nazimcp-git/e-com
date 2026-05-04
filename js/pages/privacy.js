export default function renderPrivacy() {
  const root = document.getElementById('page-root');
  root.innerHTML = `
    <div class="container" style="padding-top: calc(var(--navbar-height) + var(--space-8)); min-height: 80vh; max-width: 800px; margin: 0 auto;">
      <h1 class="heading-2" style="margin-bottom: var(--space-6);">Privacy Policy</h1>
      <div class="content-body" style="color: var(--color-text-secondary); line-height: var(--leading-relaxed);">
        <p>Your privacy is important to us. It is LUXE's policy to respect your privacy regarding any information we may collect from you across our website, <a href="/" style="color: var(--color-accent);">luxestore.com</a>.</p>

        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Information We Collect</h3>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used. The types of personal information we may collect include:</p>
        <ul style="margin-left: var(--space-4); margin-bottom: var(--space-4);">
          <li>Name and contact information</li>
          <li>Billing and shipping addresses</li>
          <li>Payment details</li>
          <li>Purchase history</li>
        </ul>
        
        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">How We Use Information</h3>
        <p>We use the information we collect in various ways, including to:</p>
        <ul style="margin-left: var(--space-4); margin-bottom: var(--space-4);">
          <li>Process your transactions and fulfill your orders</li>
          <li>Communicate with you regarding your order or inquiries</li>
          <li>Improve our website and services</li>
          <li>Send promotional emails (you can opt-out at any time)</li>
        </ul>

        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Data Storage and Security</h3>
        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
        
        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Third-Party Links</h3>
        <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
      </div>
    </div>
  `;
}
