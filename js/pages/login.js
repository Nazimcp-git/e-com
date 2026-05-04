/* LUXE — Login Page (User-Friendly Auth) */
import Store from '../store.js';
import Router from '../router.js';
import { showToast } from '../components/toast.js';
import { renderNavbar } from '../components/navbar.js';

// Translate Firebase error codes to friendly messages
function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled. Contact support.',
    'auth/user-not-found': 'No account found with this email. Sign up first!',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/missing-password': 'Please enter your password.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

function setFormMessage(type, text) {
  const el = document.getElementById('auth-msg');
  if (!el) return;
  el.className = `auth-message ${type}`;
  el.textContent = text;
  el.style.display = 'block';
}

function setLoading(loading) {
  const btn = document.querySelector('#auth-form button[type="submit"]');
  if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<span class="loader-spinner" style="width:20px;height:20px;border-width:2px;margin-right:8px"></span> Please wait...'
    : (btn.dataset.label || 'Submit');
}

export default function renderLogin() {
  const root = document.getElementById('page-root');
  if (Store.state.user) { Router.navigate('/profile'); return; }

  root.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h2>Welcome to <span class="text-gradient">LUXE</span></h2>
        <p class="subtitle">Login or create an account to continue</p>
        <div class="tabs" id="auth-tabs">
          <button class="tab-btn active" data-tab="login">Login</button>
          <button class="tab-btn" data-tab="signup">Sign Up</button>
        </div>
        <div id="auth-msg" class="auth-message" style="display:none"></div>
        <div id="auth-form-container">
          ${loginForm()}
        </div>
        <div class="auth-divider">or</div>
        <button class="google-btn" id="google-btn">
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.1 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 5.7 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.6 13.4-4.4l-6.2-5.2C29.2 35.4 26.7 36 24 36c-5.4 0-9.9-3.5-11.5-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.4l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
          Continue with Google
        </button>
        <div class="auth-switch" id="auth-switch">
          Don't have an account? <a id="switch-to-signup">Sign Up</a>
        </div>
      </div>
    </div>`;

  let mode = 'login';

  function switchMode() {
    mode = mode === 'login' ? 'signup' : 'login';
    document.querySelectorAll('#auth-tabs .tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === mode);
    });
    document.getElementById('auth-form-container').innerHTML = mode === 'login' ? loginForm() : signupForm();
    document.getElementById('auth-msg').style.display = 'none';
    updateSwitch();
    bindFormSubmit();
  }

  // Tab switching
  document.querySelectorAll('#auth-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => { mode = btn.dataset.tab === 'login' ? 'signup' : 'login'; switchMode(); });
  });

  document.getElementById('switch-to-signup')?.addEventListener('click', switchMode);

  function updateSwitch() {
    const sw = document.getElementById('auth-switch');
    sw.innerHTML = mode === 'login'
      ? `Don't have an account? <a id="switch-to-signup">Sign Up</a>`
      : `Already have an account? <a id="switch-to-signup">Login</a>`;
    document.getElementById('switch-to-signup').addEventListener('click', switchMode);
  }

  function bindFormSubmit() {
    const form = document.getElementById('auth-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-pass').value;

      if (!email) { setFormMessage('error', 'Please enter your email address.'); return; }
      if (!password) { setFormMessage('error', 'Please enter your password.'); return; }
      if (mode === 'signup' && password.length < 6) { setFormMessage('error', 'Password must be at least 6 characters.'); return; }

      setLoading(true);
      setFormMessage('info', mode === 'login' ? 'Signing you in...' : 'Creating your account...');

      try {
        const { Auth, DB } = await import('../firebase.js');
        let result;
        let name = '';
        if (mode === 'signup') {
          name = document.getElementById('auth-name')?.value.trim() || '';
          if (!name) { setFormMessage('error', 'Please enter your full name.'); setLoading(false); return; }
          result = await Auth.signUp(email, password);
          try { await DB.setUser(result.user.uid, { name, email, role: 'user', createdAt: new Date().toISOString() }); } catch(e){}
          setFormMessage('success', `Account created successfully! Welcome, ${name}!`);
        } else {
          result = await Auth.signIn(email, password);
          setFormMessage('success', 'Login successful! Redirecting...');
        }
        
        let userData = null;
        try { userData = await DB.getUser(result.user.uid); } catch(e){}
        
        Store.setUser({ uid: result.user.uid, email, name: userData?.name || name || '', isAdmin: userData?.role === 'admin' });
        showToast(`Welcome${userData?.name || name ? ', ' + (userData?.name || name) : ''}! 🎉`, 'success');
        renderNavbar();
        setTimeout(() => { Router.navigate('/'); }, 800);
      } catch (err) {
        const msg = friendlyError(err.code);
        setFormMessage('error', msg);
        showToast(msg, 'error');
        setLoading(false);
      }
    });
  }

  // Google sign-in
  document.getElementById('google-btn').addEventListener('click', async () => {
    setFormMessage('info', 'Opening Google sign-in...');
    try {
      const { Auth, DB } = await import('../firebase.js');
      const result = await Auth.googleSignIn();
      const user = result.user;
      try { await DB.setUser(user.uid, { name: user.displayName, email: user.email, role: 'user' }); } catch(e){}
      Store.setUser({ uid: user.uid, email: user.email, name: user.displayName, isAdmin: false });
      setFormMessage('success', `Welcome, ${user.displayName}! Redirecting...`);
      showToast(`Welcome, ${user.displayName}! 🎉`, 'success');
      renderNavbar();
      setTimeout(() => { Router.navigate('/'); }, 800);
    } catch (err) {
      const msg = friendlyError(err.code);
      setFormMessage('error', msg);
      showToast(msg, 'error');
    }
  });

  bindFormSubmit();
}

function loginForm() {
  return `<form id="auth-form">
    <div class="form-group"><label>Email Address</label><input type="email" class="form-input" id="auth-email" placeholder="you@example.com" required autocomplete="email" /></div>
    <div class="form-group"><label>Password</label><input type="password" class="form-input" id="auth-pass" placeholder="Enter your password" required autocomplete="current-password" /></div>
    <button type="submit" class="btn btn-primary btn-block btn-lg" data-label="Login">Login</button>
  </form>`;
}

function signupForm() {
  return `<form id="auth-form">
    <div class="form-group"><label>Full Name</label><input type="text" class="form-input" id="auth-name" placeholder="John Doe" required /></div>
    <div class="form-group"><label>Email Address</label><input type="email" class="form-input" id="auth-email" placeholder="you@example.com" required autocomplete="email" /></div>
    <div class="form-group"><label>Password</label><input type="password" class="form-input" id="auth-pass" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password" /></div>
    <button type="submit" class="btn btn-primary btn-block btn-lg" data-label="Create Account">Create Account</button>
  </form>`;
}
