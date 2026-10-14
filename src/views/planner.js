/** Weekly planner page. */
import { getMealById } from '../api/mealdb.js';
import { getFavorites } from '../modules/favorites.js';
import {
  DAYS,
  SLOTS,
  assignMeal,
  clearPlan,
  clearSlot,
  getPlan,
  getPlannedMealIds,
} from '../modules/mealPlanner.js';
import { addItems } from '../modules/shoppingList.js';
import { emptyState, escapeHtml, showToast } from '../components/ui.js';

function slotHtml(day, slot, meal, favorites) {
  const label = `${day} ${slot.toLowerCase()}`;
  if (meal) {
    return `<li class="slot slot-filled">
      <span class="slot-name">${slot}</span>
      <a class="slot-meal" href="#/recipe/${encodeURIComponent(meal.id)}">
        <img src="${escapeHtml(meal.thumb)}/preview" alt="" width="48" height="48" loading="lazy" />
        <span>${escapeHtml(meal.name)}</span>
      </a>
      <button type="button" class="btn btn-small btn-outline" data-clear data-day="${day}" data-slot="${slot}"
        aria-label="Remove ${escapeHtml(meal.name)} from ${label}">Remove</button>
    </li>`;
  }
  const picker = favorites.length
    ? `<label class="visually-hidden" for="pick-${day}-${slot}">Add a favorite to ${label}</label>
       <select id="pick-${day}-${slot}" data-assign data-day="${day}" data-slot="${slot}">
         <option value="">Add a favorite…</option>
         ${favorites.map((f) => `<option value="${escapeHtml(f.id)}">${escapeHtml(f.name)}</option>`).join('')}
       </select>`
    : '<span class="slot-empty">Nothing planned</span>';
  return `<li class="slot"><span class="slot-name">${slot}</span>${picker}</li>`;
}

export async function plannerView({ outlet }) {
  document.title = 'Meal Planner · Recipe & Meal Planner';

  function render() {
    const plan = getPlan();
    const favorites = getFavorites();
    const hasMeals = getPlannedMealIds().length > 0;

    outlet.innerHTML = `
      <h1>Weekly meal planner</h1>
      <p>Open any recipe and use <em>Add to planner</em>, or pick from your favorites below.</p>
      <div class="toolbar">
        <button type="button" class="btn btn-primary" id="plan-to-list" ${hasMeals ? '' : 'disabled'}>
          Add this week's ingredients to shopping list</button>
        <button type="button" class="btn btn-outline" id="plan-clear" ${hasMeals ? '' : 'disabled'}>Clear whole week</button>
      </div>
      ${hasMeals ? '' : emptyState('Your week is empty', 'Plan a meal to get started.', '<p><a href="#/categories">Browse recipes</a></p>')}
      <div class="planner-grid">
        ${DAYS.map(
          (day) => `<section class="day-card" aria-labelledby="day-${day}">
            <h2 class="h3" id="day-${day}">${day}</h2>
            <ul class="slots">${SLOTS.map((slot) => slotHtml(day, slot, plan[day][slot], favorites)).join('')}</ul>
          </section>`,
        ).join('')}
      </div>`;

    outlet.querySelectorAll('[data-clear]').forEach((btn) =>
      btn.addEventListener('click', () => {
        clearSlot(btn.dataset.day, btn.dataset.slot);
        render();
      }),
    );

    outlet.querySelectorAll('[data-assign]').forEach((select) =>
      select.addEventListener('change', () => {
        const meal = favorites.find((f) => f.id === select.value);
        if (!meal) return;
        assignMeal(select.dataset.day, select.dataset.slot, meal);
        render();
      }),
    );

    outlet.querySelector('#plan-clear').addEventListener('click', () => {
      if (window.confirm('Remove every meal from this week?')) {
        clearPlan();
        render();
      }
    });

    outlet.querySelector('#plan-to-list').addEventListener('click', async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Collecting ingredients…';
      try {
        const meals = await Promise.all(getPlannedMealIds().map((id) => getMealById(id)));
        const ingredients = meals.filter(Boolean).flatMap((m) => m.ingredients);
        const { added, merged } = addItems(ingredients);
        showToast(`Shopping list updated: ${added} added, ${merged} combined`);
      } catch (error) {
        showToast(`Could not load ingredients. ${error.message}`);
      }
      button.disabled = false;
      button.textContent = "Add this week's ingredients to shopping list";
    });
  }

  render();
}
