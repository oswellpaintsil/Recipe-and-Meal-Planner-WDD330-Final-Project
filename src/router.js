/**
 * Tiny hash router (#/path?query). Hash routing needs no server
 * configuration, so it works on every static host.
 */
const routes = [];
let renderToken = 0;

export function route(pattern, handler) {
  const keys = [];
  const source = pattern.replace(/:([a-zA-Z]+)/g, (_, key) => {
    keys.push(key);
    return '([^/]+)';
  });
  routes.push({ regex: new RegExp(`^${source}$`), keys, handler });
}

export function startRouter(outlet, notFoundHandler) {
  async function render() {
    const raw = window.location.hash.replace(/^#/, '') || '/';
    const [path, queryString = ''] = raw.split('?');
    const query = new URLSearchParams(queryString);

    renderToken += 1;
    const token = renderToken;
    // Views call this after any await so a slow request can't overwrite a newer page.
    const isCurrent = () => token === renderToken;

    let handler = notFoundHandler;
    const params = {};
    for (const entry of routes) {
      const match = path.match(entry.regex);
      if (match) {
        entry.keys.forEach((key, i) => {
          params[key] = decodeURIComponent(match[i + 1]);
        });
        handler = entry.handler;
        break;
      }
    }

    updateNav(path);
    await handler({ params, query, outlet, isCurrent });

    if (isCurrent()) {
      window.scrollTo(0, 0);
      // Move focus to the page heading so screen-reader users know the page changed.
      const heading = outlet.querySelector('h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  }

  window.addEventListener('hashchange', render);
  render();
}

function updateNav(path) {
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const target = link.dataset.nav;
    const active = target === '/' ? path === '/' : path.startsWith(target);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
