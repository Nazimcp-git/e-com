/* ========================================
   LUXE — SPA Router (History API)
   ======================================== */

const Router = {
  routes: [],
  currentRoute: null,
  beforeHooks: [],

  init() {
    window.addEventListener('popstate', () => this.resolve());
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });
  },

  addRoute(path, handler, meta = {}) {
    if (path === '*') {
      this.routes.push({ path, pattern: null, paramNames: [], handler, meta });
      return;
    }
    const paramNames = [];
    const pattern = path.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    this.routes.push({
      path,
      pattern: new RegExp(`^${pattern}$`),
      paramNames,
      handler,
      meta
    });
  },

  beforeEach(hook) {
    this.beforeHooks.push(hook);
  },

  navigate(path) {
    if (path === window.location.pathname) return;
    window.history.pushState(null, '', path);
    this.resolve();
  },

  async resolve() {
    const path = window.location.pathname;
    let matched = null;
    let params = {};

    for (const route of this.routes) {
      if (!route.pattern) continue;
      const match = path.match(route.pattern);
      if (match) {
        matched = route;
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        break;
      }
    }

    if (!matched) {
      matched = this.routes.find(r => r.path === '*');
      params = {};
    }

    if (!matched) return;

    // Run before hooks
    for (const hook of this.beforeHooks) {
      const result = await hook(matched, params);
      if (result === false) return;
    }

    // Page transition
    const root = document.getElementById('page-root');
    root.classList.add('page-exit');

    // Toggle home transparency for navbar
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      if (window.location.pathname === '/') navbar.classList.add('home-transparent');
      else navbar.classList.remove('home-transparent');
    }

    await new Promise(r => setTimeout(r, 200));

    this.currentRoute = { route: matched, params };
    await matched.handler(params);

    root.classList.remove('page-exit');
    root.classList.add('page-enter');
    window.scrollTo({ top: 0, behavior: 'instant' });

    setTimeout(() => root.classList.remove('page-enter'), 400);
  }
};

export default Router;
