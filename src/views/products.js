/** Food product lookup (Open Food Facts) with a details dialog. */
import { searchProducts } from '../api/openFoodFacts.js';
import { addItem } from '../modules/shoppingList.js';
import {
  bindRetry,
  emptyState,
  errorState,
  escapeHtml,
  loadingState,
  showToast,
} from '../components/ui.js';

const NUTRITION_ROWS = [
  ['energy', 'Energy', 'kcal'],
  ['fat', 'Fat', 'g'],
  ['saturatedFat', 'Saturated fat', 'g'],
  ['carbs', 'Carbohydrates', 'g'],
  ['sugars', 'Sugars', 'g'],
  ['protein', 'Protein', 'g'],
  ['salt', 'Salt', 'g'],
];

function format(value) {
  return typeof value === 'number' ? String(Math.round(value * 10) / 10) : '—';
}

function productCard(p, i) {
  return `<article class="card product-card" style="--i:${i}">
    ${
      p.thumb
        ? `<img src="${escapeHtml(p.thumb)}" alt="${escapeHtml(p.name)} package" loading="lazy" width="200" height="200" />`
        : '<div class="no-image" aria-hidden="true">No image</div>'
    }
    <div class="card-body">
      <h3>${escapeHtml(p.name)}</h3>
      <p class="muted">${escapeHtml([p.brand, p.quantity].filter(Boolean).join(' · ') || 'Brand unknown')}</p>
      ${p.nutriscore && /^[a-e]$/.test(p.nutriscore) ? `<p><span class="nutri nutri-${p.nutriscore}">Nutri-Score ${p.nutriscore.toUpperCase()}</span></p>` : ''}
      <button type="button" class="btn btn-small btn-primary" data-details="${escapeHtml(p.id)}">View details</button>
    </div>
  </article>`;
}

function detailsHtml(p) {
  return `
    <h2 id="dlg-title">${escapeHtml(p.name)}</h2>
    <p class="muted">${escapeHtml([p.brand, p.quantity].filter(Boolean).join(' · '))}</p>
    ${p.image ? `<img class="dlg-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)} package" />` : ''}
    <h3>Ingredients</h3>
    <p>${p.ingredients ? escapeHtml(p.ingredients) : 'Ingredient information is not available for this product.'}</p>
    <h3>Nutrition per 100 g</h3>
    <table class="nutrition">
      <caption class="visually-hidden">Nutritional values per 100 grams</caption>
      <thead><tr><th scope="col">Nutrient</th><th scope="col">Amount</th></tr></thead>
      <tbody>${NUTRITION_ROWS.map(
        ([key, label, unit]) =>
          `<tr><th scope="row">${label}</th><td>${format(p.nutrition[key])}${typeof p.nutrition[key] === 'number' ? ` ${unit}` : ''}</td></tr>`,
      ).join('')}</tbody>
    </table>
    <div class="toolbar">
      <button type="button" class="btn btn-primary" data-add-product>Add to shopping list</button>
      <button type="button" class="btn btn-outline" data-close>Close</button>
    </div>`;
}

export async function productsView({ query, outlet, isCurrent }) {
  const q = (query.get('q') || '').trim();
  document.title = 'Food Products · Recipe & Meal Planner';

  outlet.innerHTML = `
    <h1>Food product information</h1>
    <p>Look up packaged foods to see their ingredients and nutrition facts.</p>
    <form class="search-form" role="search" id="product-form">
      <div class="field">
        <label for="product-q">Product name</label>
        <input id="product-q" name="q" type="search" required minlength="2"
          placeholder="e.g. peanut butter, tomato sauce" value="${escapeHtml(q)}" />
      </div>
      <button type="submit" class="btn btn-primary">Search products</button>
    </form>
    <div id="product-results" aria-live="polite"></div>
    <dialog id="product-dialog" aria-labelledby="dlg-title"></dialog>`;

  outlet.querySelector('#product-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const term = String(new FormData(event.currentTarget).get('q')).trim();
    if (term) window.location.hash = `#/products?q=${encodeURIComponent(term)}`;
  });

  const results = outlet.querySelector('#product-results');
  if (!q) {
    results.innerHTML = emptyState('Search for a product', 'Results come from Open Food Facts.');
    return;
  }

  async function run() {
    results.innerHTML = loadingState(`Searching products for "${q}"… this can take a few seconds.`);
    try {
      const products = await searchProducts(q);
      if (!isCurrent()) return;
      if (products.length === 0) {
        results.innerHTML = emptyState(`No products found for "${q}"`, 'Try a more general name.');
        return;
      }
      results.innerHTML = `<div class="grid grid-wide">${products.map(productCard).join('')}</div>`;

      const dialog = outlet.querySelector('#product-dialog');
      results.addEventListener('click', (event) => {
        const button = event.target.closest('[data-details]');
        if (!button) return;
        const product = products.find((p) => p.id === button.dataset.details);
        if (!product) return;

        dialog.innerHTML = detailsHtml(product);
        dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
        dialog.querySelector('[data-add-product]').addEventListener('click', () => {
          const name = [product.brand, product.name].filter(Boolean).join(' ');
          addItem({ name, measure: product.quantity });
          showToast(`Added ${product.name} to your list`);
        });
        dialog.showModal();
      });
      // Clicking the dark backdrop closes the dialog too.
      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });
    } catch (error) {
      if (!isCurrent()) return;
      results.innerHTML = errorState(error.message);
      bindRetry(results, run);
    }
  }
  await run();
}
