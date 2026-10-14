/** Shopping list page. */
import {
  addItem,
  clearAll,
  clearChecked,
  getItems,
  removeItem,
  toggleItem,
} from '../modules/shoppingList.js';
import { emptyState, escapeHtml } from '../components/ui.js';

export async function shoppingView({ outlet }) {
  document.title = 'Shopping List · Recipe & Meal Planner';

  function render(focusSelector) {
    const items = getItems();
    const checkedCount = items.filter((i) => i.checked).length;

    outlet.innerHTML = `
      <h1>Shopping list</h1>

      <form class="inline-form" id="add-item-form">
        <div class="field">
          <label for="item-name">Item</label>
          <input id="item-name" name="name" required maxlength="80" placeholder="e.g. Tomatoes" />
        </div>
        <div class="field">
          <label for="item-measure">Quantity (optional)</label>
          <input id="item-measure" name="measure" maxlength="40" placeholder="e.g. 500g" />
        </div>
        <button type="submit" class="btn btn-primary">Add item</button>
      </form>

      ${
        items.length === 0
          ? emptyState('Your list is empty', 'Add items above or from any recipe page.')
          : `<p class="result-count">${items.length - checkedCount} to buy · ${checkedCount} in basket</p>
        <ul class="shopping-list">
          ${items
            .map(
              (item) => `<li class="${item.checked ? 'is-done' : ''}">
                <input type="checkbox" id="chk-${escapeHtml(item.id)}" data-toggle="${escapeHtml(item.id)}" ${item.checked ? 'checked' : ''} />
                <label for="chk-${escapeHtml(item.id)}">
                  <span class="item-name">${escapeHtml(item.name)}</span>
                  ${item.measure ? `<span class="item-measure">${escapeHtml(item.measure)}</span>` : ''}
                </label>
                <button type="button" class="btn btn-small btn-outline" data-remove="${escapeHtml(item.id)}"
                  aria-label="Remove ${escapeHtml(item.name)}">Remove</button>
              </li>`,
            )
            .join('')}
        </ul>
        <div class="toolbar">
          <button type="button" class="btn btn-outline" id="clear-checked" ${checkedCount ? '' : 'disabled'}>Clear ticked items</button>
          <button type="button" class="btn btn-outline" id="clear-all">Clear everything</button>
          <button type="button" class="btn btn-outline" id="print-list">Print list</button>
        </div>`
      }`;

    outlet.querySelector('#add-item-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      addItem({ name: String(data.get('name')), measure: String(data.get('measure')) });
      render('#item-name');
    });

    outlet.querySelectorAll('[data-toggle]').forEach((box) =>
      box.addEventListener('change', () => {
        toggleItem(box.dataset.toggle);
        render(`[data-toggle="${box.dataset.toggle}"]`);
      }),
    );

    outlet.querySelectorAll('[data-remove]').forEach((btn) =>
      btn.addEventListener('click', () => {
        removeItem(btn.dataset.remove);
        render('#item-name');
      }),
    );

    const bind = (selector, handler) => {
      const el = outlet.querySelector(selector);
      if (el) el.addEventListener('click', handler);
    };
    bind('#clear-checked', () => {
      clearChecked();
      render('#item-name');
    });
    bind('#clear-all', () => {
      if (window.confirm('Remove every item from your shopping list?')) {
        clearAll();
        render('#item-name');
      }
    });
    bind('#print-list', () => window.print());

    // Keep keyboard focus where the user was after the page redraws.
    if (focusSelector) {
      const target = outlet.querySelector(focusSelector);
      if (target) target.focus();
    }
  }

  render();
}
