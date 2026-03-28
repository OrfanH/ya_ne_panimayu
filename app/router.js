/* ============================================
   Router — simple client-side routing between views
   ============================================ */

const ROUTES = {
  '/': 'index',
  '/lesson': 'lesson',
  '/vocabulary': 'vocabulary',
  '/notes': 'notes',
  '/placement': 'placement',
};

let currentRoute = null;

function getRouteFromHash() {
  const hash = window.location.hash.slice(1) || '/';
  return hash.split('?')[0];
}

function getRouteParams() {
  const hash = window.location.hash.slice(1) || '/';
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return {};
  const params = new URLSearchParams(hash.slice(qIndex));
  const obj = {};
  for (const [k, v] of params) {
    obj[k] = v;
  }
  return obj;
}

function navigateTo(path, params) {
  let hash = path;
  if (params) {
    const search = new URLSearchParams(params).toString();
    if (search) hash += '?' + search;
  }
  window.location.hash = hash;
}

function hideAllViews() {
  const views = document.querySelectorAll('[data-view]');
  for (const view of views) {
    view.classList.remove('view-active');
    view.classList.add('view-hidden');
  }
}

function showView(name) {
  const view = document.querySelector(`[data-view="${name}"]`);
  if (view) {
    view.classList.remove('view-hidden');
    view.classList.add('view-active');
  }
}

function updateTabBar(routeName) {
  const tabs = document.querySelectorAll('[data-tab]');
  for (const tab of tabs) {
    tab.classList.toggle('tab-active', tab.dataset.tab === routeName);
  }
}

async function handleRoute() {
  const path = getRouteFromHash();
  const routeName = ROUTES[path];

  if (!routeName) {
    navigateTo('/');
    return;
  }

  if (routeName === currentRoute) return;
  currentRoute = routeName;

  hideAllViews();
  showView(routeName);
  updateTabBar(routeName);

  const event = new CustomEvent('routechange', {
    detail: { route: routeName, params: getRouteParams() },
  });
  window.dispatchEvent(event);
}

function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
