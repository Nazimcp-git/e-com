/* LUXE — Global State Management (Proxy-based reactive store) */

const Store = {
  _listeners: {},
  _state: {
    cart: JSON.parse(localStorage.getItem('luxe_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('luxe_wishlist') || '[]'),
    user: null,
    products: [],
    categories: [],
    heroSlides: [],
    coupons: [],
    sale: { active: false, endTime: null },
    ui: { loading: false, searchQuery: '', mobileMenuOpen: false }
  },

  get state() { return this._state; },

  // Subscribe to state changes
  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
    return () => { this._listeners[event] = this._listeners[event].filter(f => f !== fn); };
  },

  _emit(event, data) {
    (this._listeners[event] || []).forEach(fn => fn(data));
    (this._listeners['*'] || []).forEach(fn => fn(event, data));
  },

  _saveCart() {
    localStorage.setItem('luxe_cart', JSON.stringify(this._state.cart));
    this._emit('cart', this._state.cart);
  },

  // Cart operations
  addToCart(product, size, qty = 1) {
    const cart = this._state.cart;
    const key = `${product.id}_${size}`;
    const existing = cart.find(i => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key, id: product.id, title: product.title, price: product.discountPrice || product.price,
        originalPrice: product.price, image: product.images[0], size, qty, stock: product.stock
      });
    }
    this._saveCart();
  },

  removeFromCart(key) {
    this._state.cart = this._state.cart.filter(i => i.key !== key);
    this._saveCart();
  },

  updateQty(key, qty) {
    const item = this._state.cart.find(i => i.key === key);
    if (item) { item.qty = Math.max(1, Math.min(qty, item.stock)); }
    this._saveCart();
  },

  clearCart() {
    this._state.cart = [];
    this._saveCart();
  },

  getCartTotal() {
    return this._state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCartCount() {
    return this._state.cart.reduce((sum, i) => sum + i.qty, 0);
  },

  // Wishlist operations
  _saveWishlist() {
    localStorage.setItem('luxe_wishlist', JSON.stringify(this._state.wishlist));
    this._emit('wishlist', this._state.wishlist);
  },

  toggleWishlist(product) {
    const existingIdx = this._state.wishlist.findIndex(p => p.id === product.id);
    if (existingIdx > -1) {
      this._state.wishlist.splice(existingIdx, 1);
    } else {
      this._state.wishlist.push(product);
    }
    this._saveWishlist();
  },

  isInWishlist(productId) {
    return this._state.wishlist.some(p => p.id === productId);
  },

  // User
  setUser(user) {
    this._state.user = user;
    this._emit('user', user);
  },

  // Products
  setProducts(products) {
    this._state.products = products;
    this._emit('products', products);
  },

  setCategories(categories) {
    this._state.categories = categories;
    this._emit('categories', categories);
  },

  setHeroSlides(slides) {
    this._state.heroSlides = slides;
    this._emit('heroSlides', slides);
  },

  setSale(saleConfig) {
    this._state.sale = saleConfig;
    this._emit('sale', saleConfig);
  },

  setCoupons(coupons) {
    this._state.coupons = coupons;
    this._emit('coupons', coupons);
  },

  // UI
  setLoading(val) {
    this._state.ui.loading = val;
    this._emit('loading', val);
  }
};

export default Store;
