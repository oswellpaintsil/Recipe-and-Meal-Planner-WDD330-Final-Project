# Recipe & Meal Planner (WDD330 Final Project)

Vanilla JavaScript + Vite. No frameworks.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run lint       # ESLint
npm run build      # creates /dist
npm run preview    # test the production build
```
Requires Node.js 20.19+ or 22.12+.

## Project structure
```
index.html              page shell (header, nav, footer, #app outlet)
public/favicon.svg      app icon
src/
  main.js               entry point: routes, nav badges, mobile menu
  router.js             tiny hash router (#/recipe/123)
  api/
    http.js             fetch wrapper (timeout + error handling)
    mealdb.js           Recipe API Module (TheMealDB)
    openFoodFacts.js    Food API Module (Open Food Facts)
  modules/
    storage.js          Data Management Module (only file touching localStorage)
    favorites.js        Favorites Module
    mealPlanner.js      Meal Planner Module (7 days x 3 meals)
    shoppingList.js     Shopping list logic
  components/ui.js      User Interface Module (cards, forms, toasts, states)
  views/                one file per page
    home, search, categories, recipe, favorites, planner, shopping, products, notFound
  styles/               base, layout, components, animations
```

## Deploy
See the step-by-step guide in the project chat: Netlify (recommended) or GitHub Pages.
Build command: `npm run build` · Publish directory: `dist`
