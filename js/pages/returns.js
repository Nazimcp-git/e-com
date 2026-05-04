export default function renderReturns() {
  const root = document.getElementById('page-root');
  root.innerHTML = `
    <div class="container" style="padding-top: calc(var(--navbar-height) + var(--space-8)); min-height: 80vh; max-width: 800px; margin: 0 auto;">
      <h1 class="heading-2" style="margin-bottom: var(--space-6);">Returns & Exchanges</h1>
      <div class="content-body" style="color: var(--color-text-secondary); line-height: var(--leading-relaxed);">
        <p>At LUXE, we want you to be completely satisfied with your purchase. If you're not entirely happy, we're here to help.</p>

        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Return Policy</h3>
        <p>You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. Your item must be in the original packaging with all tags attached.</p>
        
        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">How to Return an Item</h3>
        <ol style="margin-left: var(--space-4); margin-bottom: var(--space-4);">
          <li>Log in to your account and go to your Order History.</li>
          <li>Select the order containing the item you wish to return.</li>
          <li>Click the 'Request Return' button and follow the instructions.</li>
          <li>You will receive a return shipping label via email.</li>
        </ol>

        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Refunds</h3>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
        
        <h3 style="color: var(--color-text-primary); margin: var(--space-6) 0 var(--space-2);">Exchanges</h3>
        <p>If you need a different size or color, please return the original item for a refund and place a new order for the desired item.</p>
      </div>
    </div>
  `;
}
