/* LUXE — Firebase Configuration & Helpers (Realtime Database) */

// ⚠️ Replace with YOUR Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBGMfjKSH3fk1JOeQvSo2uzqlNTMMQFBWc",
  authDomain: "webcam-f1269.firebaseapp.com",
  databaseURL: "https://webcam-f1269-default-rtdb.firebaseio.com",
  projectId: "webcam-f1269",
  storageBucket: "webcam-f1269.appspot.com",
  messagingSenderId: "90764998407",
  appId: "1:90764998407:web:f97e4844b53f7fa1b7f7a2",
  measurementId: "G-FBE6KKQ1X2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database(); // Changed to Realtime Database
const storage = firebase.storage();

// ─── Auth Helpers ───
const Auth = {
  signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  },
  signIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  },
  googleSignIn() {
    return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  },
  signOut() {
    return auth.signOut();
  },
  onAuthChange(cb) {
    return auth.onAuthStateChanged(cb);
  },
  currentUser() {
    return auth.currentUser;
  }
};

// ─── Realtime Database Helpers ───
const DB = {
  // Products
  async getProducts() {
    const snap = await db.ref('products').once('value');
    const val = snap.val();
    if (!val) return [];
    return Object.keys(val).map(key => ({ id: key, ...val[key] }));
  },
  async getProductById(id) {
    const snap = await db.ref(`products/${id}`).once('value');
    return snap.exists() ? { id: snap.key, ...snap.val() } : null;
  },
  async addProduct(data) {
    const ref = db.ref('products').push();
    await ref.set(data);
    return ref;
  },
  async updateProduct(id, data) {
    return db.ref(`products/${id}`).update(data);
  },
  async deleteProduct(id) {
    return db.ref(`products/${id}`).remove();
  },

  // Reviews
  async addReview(productId, review) {
    const ref = db.ref(`products/${productId}/reviews`).push();
    await ref.set({
      ...review,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
    return ref;
  },
  async getReviews(productId) {
    const snap = await db.ref(`products/${productId}/reviews`).orderByChild('createdAt').once('value');
    const val = snap.val();
    if (!val) return [];
    // Convert object to array and reverse to get descending order
    return Object.keys(val).map(key => ({ id: key, ...val[key] })).sort((a, b) => b.createdAt - a.createdAt);
  },

  // Orders
  async addOrder(order) {
    const ref = db.ref('orders').push();
    await ref.set({ ...order, createdAt: firebase.database.ServerValue.TIMESTAMP });
    return ref;
  },
  async getUserOrders(uid) {
    const snap = await db.ref('orders').orderByChild('uid').equalTo(uid).once('value');
    const val = snap.val();
    if (!val) return [];
    return Object.keys(val).map(key => ({ id: key, ...val[key] })).sort((a, b) => b.createdAt - a.createdAt);
  },
  async updateOrderStatus(id, status) {
    return db.ref(`orders/${id}`).update({ status });
  },
  async getAllOrders() {
    const snap = await db.ref('orders').orderByChild('createdAt').once('value');
    const val = snap.val();
    if (!val) return [];
    return Object.keys(val).map(key => ({ id: key, ...val[key] })).sort((a, b) => b.createdAt - a.createdAt);
  },

  // Users
  async getUser(uid) {
    const snap = await db.ref(`users/${uid}`).once('value');
    return snap.exists() ? snap.val() : null;
  },
  async setUser(uid, data) {
    return db.ref(`users/${uid}`).update(data); // update merges data in RTDB
  },

  // Coupons
  async getCoupon(code) {
    const snap = await db.ref('coupons').orderByChild('code').equalTo(code.toUpperCase()).once('value');
    const val = snap.val();
    if (!val) return null;
    const firstKey = Object.keys(val)[0];
    return { id: firstKey, ...val[firstKey] };
  },
  async getAllCoupons() {
    const snap = await db.ref('coupons').once('value');
    const val = snap.val();
    if (!val) return [];
    return Object.keys(val).map(key => ({ id: key, ...val[key] }));
  },
  async addCoupon(data) {
    const ref = db.ref('coupons').push();
    if (data.code) data.code = data.code.toUpperCase().trim();
    await ref.set({ ...data, createdAt: firebase.database.ServerValue.TIMESTAMP });
    return ref.key;
  },
  async updateCoupon(id, data) {
    if (data.code) data.code = data.code.toUpperCase().trim();
    return db.ref(`coupons/${id}`).update(data);
  },
  async deleteCoupon(id) {
    return db.ref(`coupons/${id}`).remove();
  },

  // Content (Hero, Categories)
  async getContent(docId) {
    const snap = await db.ref(`content/${docId}`).once('value');
    return snap.exists() ? snap.val() : null;
  },
  async setContent(docId, data) {
    return db.ref(`content/${docId}`).set(data); // overwrite
  }
};

export { Auth, DB, db, storage };
