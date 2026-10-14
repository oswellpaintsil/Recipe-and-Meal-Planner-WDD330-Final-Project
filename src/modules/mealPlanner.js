/** Meal Planner Module - weekly schedule (7 days x 3 meal slots). */
import { KEYS, load, save } from './storage.js';

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
export const SLOTS = ['Breakfast', 'Lunch', 'Dinner'];

function emptyPlan() {
  return Object.fromEntries(
    DAYS.map((day) => [day, Object.fromEntries(SLOTS.map((slot) => [slot, null]))]),
  );
}

/** Always returns a complete plan, even if stored data is missing or damaged. */
export function getPlan() {
  const stored = load(KEYS.mealPlan, null);
  const plan = emptyPlan();
  if (stored && typeof stored === 'object') {
    DAYS.forEach((day) => {
      SLOTS.forEach((slot) => {
        const meal = stored[day] && stored[day][slot];
        if (meal && meal.id) plan[day][slot] = meal;
      });
    });
  }
  return plan;
}

export function assignMeal(day, slot, meal) {
  const plan = getPlan();
  plan[day][slot] = { id: meal.id, name: meal.name, thumb: meal.thumb };
  return save(KEYS.mealPlan, plan);
}

export function clearSlot(day, slot) {
  const plan = getPlan();
  plan[day][slot] = null;
  return save(KEYS.mealPlan, plan);
}

export function clearPlan() {
  return save(KEYS.mealPlan, emptyPlan());
}

export function getPlannedMealIds() {
  const plan = getPlan();
  const ids = new Set();
  DAYS.forEach((day) => SLOTS.forEach((slot) => plan[day][slot] && ids.add(plan[day][slot].id)));
  return [...ids];
}
