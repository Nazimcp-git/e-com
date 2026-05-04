export default function renderContact() {
  const root = document.getElementById('page-root');
  root.innerHTML = `
    <div class="container" style="padding-top: calc(var(--navbar-height) + var(--space-8)); min-height: 80vh; max-width: 800px; margin: 0 auto;">
      <h1 class="heading-2" style="margin-bottom: var(--space-2); text-align: center;">Contact Us</h1>
      <p style="text-align: center; color: var(--color-text-secondary); margin-bottom: var(--space-8);">We'd love to hear from you. Please fill out the form below or reach out to us directly.</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); align-items: start;">
        <form style="display: flex; flex-direction: column; gap: var(--space-4);" onsubmit="event.preventDefault(); alert('Thank you for contacting us! We will get back to you soon.'); this.reset();">
          <div>
            <label class="form-label" style="display: block; margin-bottom: var(--space-2); font-weight: var(--font-medium);">Full Name</label>
            <input type="text" class="form-input" required placeholder="John Doe" style="width: 100%; height: 44px; padding: 0 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-input);">
          </div>
          <div>
            <label class="form-label" style="display: block; margin-bottom: var(--space-2); font-weight: var(--font-medium);">Email Address</label>
            <input type="email" class="form-input" required placeholder="john@example.com" style="width: 100%; height: 44px; padding: 0 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-input);">
          </div>
          <div>
            <label class="form-label" style="display: block; margin-bottom: var(--space-2); font-weight: var(--font-medium);">Message</label>
            <textarea class="form-input" required rows="5" placeholder="How can we help you?" style="width: 100%; padding: 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-input); font-family: inherit; resize: vertical;"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: var(--space-2); width: 100%;">Send Message</button>
        </form>
        
        <div style="padding: var(--space-6); background: var(--color-bg-surface); border-radius: var(--radius-lg);">
          <h3 style="margin-bottom: var(--space-4); font-family: var(--font-heading);">Get in Touch</h3>
          
          <div style="margin-bottom: var(--space-4);">
            <strong style="display: block; margin-bottom: var(--space-1); color: var(--color-text-primary);">📍 Headquarters</strong>
            <span style="color: var(--color-text-secondary);">123 Luxury Avenue, Suite 100<br>New York, NY 10001</span>
          </div>
          
          <div style="margin-bottom: var(--space-4);">
            <strong style="display: block; margin-bottom: var(--space-1); color: var(--color-text-primary);">📧 Email</strong>
            <a href="mailto:support@luxestore.com" style="color: var(--color-accent);">support@luxestore.com</a>
          </div>
          
          <div>
            <strong style="display: block; margin-bottom: var(--space-1); color: var(--color-text-primary);">📞 Phone</strong>
            <span style="color: var(--color-text-secondary);">+1 (800) 123-4567<br>Mon-Fri, 9am - 6pm EST</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
