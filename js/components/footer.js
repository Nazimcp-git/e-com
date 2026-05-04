/* LUXE — Footer Component */

export function renderFooter() {
  document.getElementById('footer-root').innerHTML = `
    <div class="footer" style="margin-top:5rem">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo"><span>LUXE</span></div>
            <p>Premium fashion for the modern lifestyle. Quality fabrics, timeless designs, delivered to your doorstep.</p>
            <div class="footer-socials">
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="YouTube">🎬</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Shop</h4>
            <a href="/products/men" data-link>Men</a>
            <a href="/products/women" data-link>Women</a>
            <a href="/products/kids" data-link>Kids</a>
            <a href="/products/accessories" data-link>Accessories</a>
            <a href="/products" data-link>New Arrivals</a>
          </div>
          <div class="footer-col">
            <h4>Account</h4>
            <a href="/login" data-link>Login</a>
            <a href="/orders" data-link>My Orders</a>
            <a href="/profile" data-link>Profile</a>
            <a href="/cart" data-link>Cart</a>
            <a href="/admin" data-link style="color:var(--color-accent);margin-top:var(--space-2)">Admin Panel</a>
          </div>
          <div class="footer-col">
            <h4>Support</h4>
            <a href="/contact" data-link>Contact Us</a>
            <a href="/faq" data-link>FAQ</a>
            <a href="/shipping" data-link>Shipping Info</a>
            <a href="/returns" data-link>Returns & Exchange</a>
            <a href="/privacy" data-link>Privacy Policy</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 LUXE. All rights reserved.</span>
          <div class="footer-payments">
            💳 Visa &nbsp; Mastercard &nbsp; UPI &nbsp; Razorpay
          </div>
        </div>
      </div>
    </div>`;
}
