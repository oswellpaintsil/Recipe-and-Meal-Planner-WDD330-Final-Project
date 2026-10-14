export function notFoundView({ outlet }) {
  document.title = 'Page not found · Recipe & Meal Planner';
  outlet.innerHTML = `
    <h1>Page not found</h1>
    <div class="state"><p>That page does not exist.</p>
    <p><a class="btn btn-primary" href="#/">Go home</a></p></div>`;
}
