(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const U=[];let P=0;function f(e,t){const n=[],r=e.replace(/:([a-zA-Z]+)/g,(a,i)=>(n.push(i),"([^/]+)"));U.push({regex:new RegExp(`^${r}$`),keys:n,handler:t})}function te(e,t){async function n(){const r=window.location.hash.replace(/^#/,"")||"/",[a,i=""]=r.split("?"),o=new URLSearchParams(i);P+=1;const c=P,d=()=>c===P;let p=t;const m={};for(const l of U){const F=a.match(l.regex);if(F){l.keys.forEach((X,ee)=>{m[X]=decodeURIComponent(F[ee+1])}),p=l.handler;break}}if(ne(a),await p({params:m,query:o,outlet:e,isCurrent:d}),d()){window.scrollTo(0,0);const l=e.querySelector("h1");l&&(l.setAttribute("tabindex","-1"),l.focus({preventScroll:!0}))}}window.addEventListener("hashchange",n),n()}function ne(e){document.querySelectorAll("[data-nav]").forEach(t=>{const n=t.dataset.nav;(n==="/"?e==="/":e.startsWith(n))?t.setAttribute("aria-current","page"):t.removeAttribute("aria-current")})}const D="rmp:",u={favorites:"favorites",mealPlan:"mealPlan",shoppingList:"shoppingList"};function x(e,t){try{const n=localStorage.getItem(D+e);return n?JSON.parse(n):t}catch{return t}}function h(e,t){try{return localStorage.setItem(D+e,JSON.stringify(t)),window.dispatchEvent(new CustomEvent("app:storage",{detail:{key:e}})),!0}catch{return!1}}function S(){const e=x(u.favorites,[]);return Array.isArray(e)?e:[]}function O(e){return S().some(t=>t.id===e)}function ae(e){const t=S(),n=t.some(a=>a.id===e.id),r=n?t.filter(a=>a.id!==e.id):[...t,{id:e.id,name:e.name,thumb:e.thumb}];return h(u.favorites,r),!n}function re(){return globalThis.crypto&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`}function v(){const e=x(u.shoppingList,[]);return Array.isArray(e)?e:[]}function R({name:e,measure:t=""}){const n=e.trim(),r=t.trim(),a=v(),i=a.find(o=>o.name.toLowerCase()===n.toLowerCase());return i?(r&&!i.measure.includes(r)&&(i.measure=i.measure?`${i.measure} + ${r}`:r),i.checked=!1,h(u.shoppingList,a),"merged"):(a.push({id:re(),name:n,measure:r,checked:!1}),h(u.shoppingList,a),"added")}function V(e){return e.reduce((t,n)=>(t[R(n)]+=1,t),{added:0,merged:0})}function ie(e){const t=v().map(n=>n.id===e?{...n,checked:!n.checked}:n);h(u.shoppingList,t)}function oe(e){h(u.shoppingList,v().filter(t=>t.id!==e))}function se(){h(u.shoppingList,v().filter(e=>!e.checked))}function ce(){h(u.shoppingList,[])}async function w(e,{timeout:t=15e3}={}){const n=new AbortController,r=setTimeout(()=>n.abort(),t);try{const a=await fetch(e,{signal:n.signal});if(!a.ok)throw new Error(`Request failed (${a.status})`);return await a.json()}catch(a){throw a.name==="AbortError"?new Error("The request took too long. Please try again."):a}finally{clearTimeout(r)}}const L="https://www.themealdb.com/api/json/v1/1",le="https://www.themealdb.com/images/ingredients";function I(e){return{id:e.idMeal,name:e.strMeal,thumb:e.strMealThumb}}function z(e){const t=[];for(let n=1;n<=20;n+=1){const r=(e[`strIngredient${n}`]||"").trim(),a=(e[`strMeasure${n}`]||"").trim();r&&t.push({name:r,measure:a})}return{...I(e),category:e.strCategory||"",area:e.strArea||"",instructions:e.strInstructions||"",tags:e.strTags?e.strTags.split(",").map(n=>n.trim()):[],youtube:e.strYoutube||"",source:e.strSource||"",ingredients:t}}async function de(e){return((await w(`${L}/search.php?s=${encodeURIComponent(e)}`)).meals||[]).map(I)}async function ue(e){const t=e.trim().toLowerCase().replace(/\s+/g,"_");return((await w(`${L}/filter.php?i=${encodeURIComponent(t)}`)).meals||[]).map(I)}async function W(){return((await w(`${L}/categories.php`)).categories||[]).map(t=>({id:t.idCategory,name:t.strCategory,thumb:t.strCategoryThumb,description:t.strCategoryDescription}))}async function pe(e){return((await w(`${L}/filter.php?c=${encodeURIComponent(e)}`)).meals||[]).map(I)}async function Y(e){const t=await w(`${L}/lookup.php?i=${encodeURIComponent(e)}`);return t.meals&&t.meals[0]?z(t.meals[0]):null}async function j(){const e=await w(`${L}/random.php`);return e.meals&&e.meals[0]?z(e.meals[0]):null}const k=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],M=["Breakfast","Lunch","Dinner"];function G(){return Object.fromEntries(k.map(e=>[e,Object.fromEntries(M.map(t=>[t,null]))]))}function C(){const e=x(u.mealPlan,null),t=G();return e&&typeof e=="object"&&k.forEach(n=>{M.forEach(r=>{const a=e[n]&&e[n][r];a&&a.id&&(t[n][r]=a)})}),t}function J(e,t,n){const r=C();return r[e][t]={id:n.id,name:n.name,thumb:n.thumb},h(u.mealPlan,r)}function me(e,t){const n=C();return n[e][t]=null,h(u.mealPlan,n)}function he(){return h(u.mealPlan,G())}function H(){const e=C(),t=new Set;return k.forEach(n=>M.forEach(r=>e[n][r]&&t.add(e[n][r].id))),[...t]}const ge={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function s(e=""){return String(e).replace(/[&<>"']/g,t=>ge[t])}function y(e="Loading…"){return`<div class="state" role="status"><span class="spinner" aria-hidden="true"></span><p>${s(e)}</p></div>`}function $(e,t="Try again"){return`<div class="state state-error" role="alert">
    <p><strong>Something went wrong.</strong></p>
    <p>${s(e)}</p>
    <button type="button" class="btn" data-retry>${s(t)}</button>
  </div>`}function g(e,t="",n=""){return`<div class="state"><h2 class="h3">${s(e)}</h2>${t?`<p>${s(t)}</p>`:""}${n}</div>`}function q(e,t){const n=e.querySelector("[data-retry]");n&&n.addEventListener("click",t)}function b(e){const t=document.getElementById("toast-region");if(!t)return;const n=document.createElement("p");n.className="toast",n.textContent=e,t.appendChild(n),setTimeout(()=>n.remove(),3200)}function K({id:e,query:t="",type:n="name"}={}){return`<form class="search-form" role="search" data-search-form>
    <div class="field">
      <label for="${e}-q">Search recipes</label>
      <input id="${e}-q" name="q" type="search" required minlength="2"
        placeholder="e.g. lasagne, chicken, rice" value="${s(t)}" />
    </div>
    <div class="field">
      <label for="${e}-type">Search by</label>
      <select id="${e}-type" name="type">
        <option value="name" ${n==="name"?"selected":""}>Meal name</option>
        <option value="ingredient" ${n==="ingredient"?"selected":""}>Ingredient</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary">Search</button>
  </form>`}function Z(e){const t=e.querySelector("[data-search-form]");t&&t.addEventListener("submit",n=>{n.preventDefault();const r=new FormData(t),a=String(r.get("q")).trim();a&&(window.location.hash=`#/search?q=${encodeURIComponent(a)}&type=${r.get("type")}`)})}function fe(e,t=0){const n=O(e.id),r=s(e.name);return`<article class="card recipe-card" style="--i:${t}">
    <a class="card-link" href="#/recipe/${encodeURIComponent(e.id)}">
      <img src="${s(e.thumb)}/preview" alt="${r}" loading="lazy" width="250" height="250" />
      <h3>${r}</h3>
    </a>
    <button type="button" class="fav-btn" data-fav
      data-id="${s(e.id)}" data-name="${r}" data-thumb="${s(e.thumb)}"
      aria-label="${n?"Remove from":"Save to"} favorites: ${r}">
      <span aria-hidden="true">${n?"♥":"♡"}</span>
    </button>
  </article>`}function A(e){return`<div class="grid">${e.map((t,n)=>fe(t,n)).join("")}</div>`}function T(e,t){e.addEventListener("click",n=>{const r=n.target.closest("[data-fav]");if(!r)return;const a={id:r.dataset.id,name:r.dataset.name,thumb:r.dataset.thumb},i=ae(a);be(r,i),b(i?`Saved "${a.name}" to favorites`:`Removed "${a.name}"`),t&&t(a,i)})}function be(e,t){e.setAttribute("aria-label",`${t?"Remove from":"Save to"} favorites: ${e.dataset.name}`);const n=e.querySelector("span[aria-hidden]");n?n.textContent=t?"♥":"♡":e.dataset.text&&(e.textContent=t?"Remove favorite":"Save favorite")}async function _({outlet:e,isCurrent:t}){document.title="Recipe & Meal Planner",e.innerHTML=`
    <section class="hero">
      <h1>What are we cooking this week?</h1>
      <p>Find recipes by name or by the ingredients you already have, then plan your week.</p>
      ${K({id:"home"})}
      <button type="button" class="btn btn-accent" id="random-btn">Surprise me with a recipe</button>
      <p class="form-error" id="random-error" role="alert"></p>
    </section>

    <section aria-labelledby="quick-h" class="tiles">
      <h2 id="quick-h" class="visually-hidden">Your kitchen at a glance</h2>
      <a class="tile" href="#/favorites"><strong>${S().length}</strong><span>Favorite recipes</span></a>
      <a class="tile" href="#/planner"><strong>${H().length}</strong><span>Meals planned</span></a>
      <a class="tile" href="#/shopping"><strong>${v().length}</strong><span>Shopping items</span></a>
      <a class="tile" href="#/products"><strong>🔍</strong><span>Look up food products</span></a>
    </section>

    <section aria-labelledby="cats-h">
      <h2 id="cats-h">Browse by category</h2>
      <div id="home-cats">${y("Loading categories…")}</div>
    </section>

    <section aria-labelledby="feat-h">
      <h2 id="feat-h">Recipe ideas for you</h2>
      <div id="home-featured">${y("Finding recipes…")}</div>
    </section>`,Z(e),e.querySelector("#random-btn").addEventListener("click",async o=>{const c=o.currentTarget,d=e.querySelector("#random-error");d.textContent="",c.disabled=!0;try{const p=await j();p&&(window.location.hash=`#/recipe/${p.id}`)}catch(p){d.textContent=`Could not fetch a random recipe. ${p.message}`,c.disabled=!1}});const n=e.querySelector("#home-cats"),r=e.querySelector("#home-featured"),[a,i]=await Promise.allSettled([W(),Promise.all(Array.from({length:6},()=>j()))]);if(t())if(a.status==="fulfilled"?n.innerHTML=`<ul class="chip-list">${a.value.map(o=>`<li><a class="chip" href="#/categories/${encodeURIComponent(o.name)}">${s(o.name)}</a></li>`).join("")}</ul>`:(n.innerHTML=$(a.reason.message),n.querySelector("[data-retry]").addEventListener("click",()=>_({outlet:e,isCurrent:t}))),i.status==="fulfilled"){const o=[...new Map(i.value.filter(Boolean).map(c=>[c.id,c])).values()];r.innerHTML=A(o),T(r)}else r.innerHTML=$(i.reason.message),r.querySelector("[data-retry]").addEventListener("click",()=>_({outlet:e,isCurrent:t}))}async function ye({query:e,outlet:t,isCurrent:n}){const r=(e.get("q")||"").trim(),a=e.get("type")==="ingredient"?"ingredient":"name";document.title=r?`Search: ${r} · Recipe & Meal Planner`:"Search · Recipe & Meal Planner",t.innerHTML=`
    <h1>Search recipes</h1>
    ${K({id:"page",query:r,type:a})}
    <div id="results" aria-live="polite"></div>`,Z(t);const i=t.querySelector("#results");if(!r){i.innerHTML=g("Start searching","Type a meal name or an ingredient above.");return}async function o(){i.innerHTML=y(`Searching for "${r}"…`);try{const c=a==="ingredient"?await ue(r):await de(r);if(!n())return;if(c.length===0){i.innerHTML=g(`No recipes found for "${r}"`,a==="ingredient"?"Try a single ingredient such as chicken, salmon or potatoes.":"Check your spelling or try a shorter word.");return}i.innerHTML=`<p class="result-count">${c.length} recipe${c.length===1?"":"s"} found for <strong>${s(r)}</strong></p>${A(c)}`,T(i)}catch(c){if(!n())return;i.innerHTML=$(c.message),q(i,o)}}await o()}async function $e({outlet:e,isCurrent:t}){document.title="Categories · Recipe & Meal Planner",e.innerHTML='<h1>Recipe categories</h1><div id="cat-list"></div>';const n=e.querySelector("#cat-list");async function r(){n.innerHTML=y("Loading categories…");try{const a=await W();if(!t())return;n.innerHTML=`<div class="grid grid-wide">${a.map((i,o)=>`<article class="card category-card" style="--i:${o}">
            <a class="card-link" href="#/categories/${encodeURIComponent(i.name)}">
              <img src="${s(i.thumb)}" alt="" loading="lazy" width="300" height="225" />
              <h2 class="h3">${s(i.name)}</h2>
              <p>${s(i.description.slice(0,110))}…</p>
            </a>
          </article>`).join("")}</div>`}catch(a){if(!t())return;n.innerHTML=$(a.message),q(n,r)}}await r()}async function ve({params:e,outlet:t,isCurrent:n}){const r=e.name;document.title=`${r} recipes · Recipe & Meal Planner`,t.innerHTML=`
    <p><a href="#/categories">← All categories</a></p>
    <h1>${s(r)} recipes</h1>
    <div id="cat-meals" aria-live="polite"></div>`;const a=t.querySelector("#cat-meals");async function i(){a.innerHTML=y(`Loading ${r} recipes…`);try{const o=await pe(r);if(!n())return;if(o.length===0){a.innerHTML=g("No recipes in this category yet");return}a.innerHTML=A(o),T(a)}catch(o){if(!n())return;a.innerHTML=$(o.message),q(a,i)}}await i()}function we(e){return e.split(/\r?\n+/).map(t=>t.trim()).filter(t=>t&&!/^(step\s*\d+|\d+\.?)$/i.test(t))}function Se(e){const t=O(e.id),n=s(e.name),r=[e.category,e.area,...e.tags].filter(Boolean);return`
    <article class="recipe">
      <p><button type="button" class="link-btn" data-back>← Back</button></p>

      <div class="recipe-header">
        <img class="recipe-img" src="${s(e.thumb)}" alt="${n}" width="500" height="500" />
        <div>
          <h1>${n}</h1>
          <ul class="chip-list">${r.map(a=>`<li class="chip chip-static">${s(a)}</li>`).join("")}</ul>

          <div class="actions">
            <button type="button" class="btn ${t?"btn-accent":""}" data-fav data-text
              data-id="${s(e.id)}" data-name="${n}" data-thumb="${s(e.thumb)}">${t?"Remove favorite":"Save favorite"}</button>
          </div>

          <form class="planner-form" data-planner-form>
            <h2 class="h3">Add to weekly planner</h2>
            <div class="field">
              <label for="plan-day">Day</label>
              <select id="plan-day" name="day">${k.map(a=>`<option>${a}</option>`).join("")}</select>
            </div>
            <div class="field">
              <label for="plan-slot">Meal</label>
              <select id="plan-slot" name="slot">${M.map(a=>`<option>${a}</option>`).join("")}</select>
            </div>
            <button type="submit" class="btn btn-primary">Add to planner</button>
          </form>
        </div>
      </div>

      <div class="recipe-body">
        <section aria-labelledby="ing-h">
          <h2 id="ing-h">Ingredients</h2>
          <button type="button" class="btn btn-small" data-add-all>Add all to shopping list</button>
          <ul class="ingredient-list">
            ${e.ingredients.map((a,i)=>`<li>
                  <img src="${le}/${encodeURIComponent(a.name)}-Small.png" alt="" width="40" height="40" loading="lazy" />
                  <span><strong>${s(a.measure)}</strong> ${s(a.name)}</span>
                  <button type="button" class="btn btn-small btn-outline" data-add-ing="${i}"
                    aria-label="Add ${s(a.name)} to shopping list">+ List</button>
                </li>`).join("")}
          </ul>
        </section>

        <section aria-labelledby="ins-h">
          <h2 id="ins-h">Instructions</h2>
          <ol class="steps">${we(e.instructions).map(a=>`<li>${s(a)}</li>`).join("")}</ol>
          <p class="links">
            ${e.youtube?`<a href="${s(e.youtube)}" target="_blank" rel="noopener">Watch video tutorial</a>`:""}
            ${e.source?`<a href="${s(e.source)}" target="_blank" rel="noopener">Original source</a>`:""}
          </p>
        </section>
      </div>
    </article>`}function Le(e,t){e.querySelector("[data-back]").addEventListener("click",()=>{window.history.length>1?window.history.back():window.location.hash="#/"}),T(e,(n,r)=>{const a=e.querySelector("[data-fav]");a.textContent=r?"Remove favorite":"Save favorite",a.classList.toggle("btn-accent",r)}),e.querySelector("[data-planner-form]").addEventListener("submit",n=>{n.preventDefault();const r=new FormData(n.currentTarget),a=r.get("day"),i=r.get("slot");J(a,i,t)?b(`Added to ${a} ${i.toLowerCase()}`):b("Could not save the plan. Is browser storage full or blocked?")}),e.querySelector("[data-add-all]").addEventListener("click",()=>{const{added:n,merged:r}=V(t.ingredients);b(`Shopping list updated: ${n} added, ${r} combined`)}),e.querySelectorAll("[data-add-ing]").forEach(n=>{n.addEventListener("click",()=>{const r=t.ingredients[Number(n.dataset.addIng)],a=R(r);b(a==="added"?`Added ${r.name} to your list`:`${r.name} is already on your list`)})})}async function ke({params:e,outlet:t,isCurrent:n}){async function r(){t.innerHTML=y("Loading recipe…");try{const a=await Y(e.id);if(!n())return;if(!a){t.innerHTML=`<h1>Recipe not found</h1>${g("We could not find that recipe","",'<p><a href="#/">Back to home</a></p>')}`;return}document.title=`${a.name} · Recipe & Meal Planner`,t.innerHTML=Se(a),Le(t,a)}catch(a){if(!n())return;t.innerHTML=`<h1>Recipe</h1>${$(a.message)}`,q(t,r)}}await r()}async function Me({outlet:e}){document.title="Favorites · Recipe & Meal Planner";function t(){const n=S();e.innerHTML=`<h1>Your favorite recipes</h1>${n.length?`<div id="fav-list">${A(n)}</div>`:g("No favorites yet","Tap the heart on any recipe to save it here.",'<p><a class="btn btn-primary" href="#/categories">Browse recipes</a></p>')}`;const r=e.querySelector("#fav-list");r&&T(r,()=>setTimeout(t,250))}t()}function qe(e,t,n,r){const a=`${e} ${t.toLowerCase()}`;if(n)return`<li class="slot slot-filled">
      <span class="slot-name">${t}</span>
      <a class="slot-meal" href="#/recipe/${encodeURIComponent(n.id)}">
        <img src="${s(n.thumb)}/preview" alt="" width="48" height="48" loading="lazy" />
        <span>${s(n.name)}</span>
      </a>
      <button type="button" class="btn btn-small btn-outline" data-clear data-day="${e}" data-slot="${t}"
        aria-label="Remove ${s(n.name)} from ${a}">Remove</button>
    </li>`;const i=r.length?`<label class="visually-hidden" for="pick-${e}-${t}">Add a favorite to ${a}</label>
       <select id="pick-${e}-${t}" data-assign data-day="${e}" data-slot="${t}">
         <option value="">Add a favorite…</option>
         ${r.map(o=>`<option value="${s(o.id)}">${s(o.name)}</option>`).join("")}
       </select>`:'<span class="slot-empty">Nothing planned</span>';return`<li class="slot"><span class="slot-name">${t}</span>${i}</li>`}async function Te({outlet:e}){document.title="Meal Planner · Recipe & Meal Planner";function t(){const n=C(),r=S(),a=H().length>0;e.innerHTML=`
      <h1>Weekly meal planner</h1>
      <p>Open any recipe and use <em>Add to planner</em>, or pick from your favorites below.</p>
      <div class="toolbar">
        <button type="button" class="btn btn-primary" id="plan-to-list" ${a?"":"disabled"}>
          Add this week's ingredients to shopping list</button>
        <button type="button" class="btn btn-outline" id="plan-clear" ${a?"":"disabled"}>Clear whole week</button>
      </div>
      ${a?"":g("Your week is empty","Plan a meal to get started.",'<p><a href="#/categories">Browse recipes</a></p>')}
      <div class="planner-grid">
        ${k.map(i=>`<section class="day-card" aria-labelledby="day-${i}">
            <h2 class="h3" id="day-${i}">${i}</h2>
            <ul class="slots">${M.map(o=>qe(i,o,n[i][o],r)).join("")}</ul>
          </section>`).join("")}
      </div>`,e.querySelectorAll("[data-clear]").forEach(i=>i.addEventListener("click",()=>{me(i.dataset.day,i.dataset.slot),t()})),e.querySelectorAll("[data-assign]").forEach(i=>i.addEventListener("change",()=>{const o=r.find(c=>c.id===i.value);o&&(J(i.dataset.day,i.dataset.slot,o),t())})),e.querySelector("#plan-clear").addEventListener("click",()=>{window.confirm("Remove every meal from this week?")&&(he(),t())}),e.querySelector("#plan-to-list").addEventListener("click",async i=>{const o=i.currentTarget;o.disabled=!0,o.textContent="Collecting ingredients…";try{const d=(await Promise.all(H().map(l=>Y(l)))).filter(Boolean).flatMap(l=>l.ingredients),{added:p,merged:m}=V(d);b(`Shopping list updated: ${p} added, ${m} combined`)}catch(c){b(`Could not load ingredients. ${c.message}`)}o.disabled=!1,o.textContent="Add this week's ingredients to shopping list"})}t()}async function Ee({outlet:e}){document.title="Shopping List · Recipe & Meal Planner";function t(n){const r=v(),a=r.filter(o=>o.checked).length;e.innerHTML=`
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

      ${r.length===0?g("Your list is empty","Add items above or from any recipe page."):`<p class="result-count">${r.length-a} to buy · ${a} in basket</p>
        <ul class="shopping-list">
          ${r.map(o=>`<li class="${o.checked?"is-done":""}">
                <input type="checkbox" id="chk-${s(o.id)}" data-toggle="${s(o.id)}" ${o.checked?"checked":""} />
                <label for="chk-${s(o.id)}">
                  <span class="item-name">${s(o.name)}</span>
                  ${o.measure?`<span class="item-measure">${s(o.measure)}</span>`:""}
                </label>
                <button type="button" class="btn btn-small btn-outline" data-remove="${s(o.id)}"
                  aria-label="Remove ${s(o.name)}">Remove</button>
              </li>`).join("")}
        </ul>
        <div class="toolbar">
          <button type="button" class="btn btn-outline" id="clear-checked" ${a?"":"disabled"}>Clear ticked items</button>
          <button type="button" class="btn btn-outline" id="clear-all">Clear everything</button>
          <button type="button" class="btn btn-outline" id="print-list">Print list</button>
        </div>`}`,e.querySelector("#add-item-form").addEventListener("submit",o=>{o.preventDefault();const c=new FormData(o.currentTarget);R({name:String(c.get("name")),measure:String(c.get("measure"))}),t("#item-name")}),e.querySelectorAll("[data-toggle]").forEach(o=>o.addEventListener("change",()=>{ie(o.dataset.toggle),t(`[data-toggle="${o.dataset.toggle}"]`)})),e.querySelectorAll("[data-remove]").forEach(o=>o.addEventListener("click",()=>{oe(o.dataset.remove),t("#item-name")}));const i=(o,c)=>{const d=e.querySelector(o);d&&d.addEventListener("click",c)};if(i("#clear-checked",()=>{se(),t("#item-name")}),i("#clear-all",()=>{window.confirm("Remove every item from your shopping list?")&&(ce(),t("#item-name"))}),i("#print-list",()=>window.print()),n){const o=e.querySelector(n);o&&o.focus()}}t()}const Re="https://world.openfoodfacts.org",Ie=12,Ce=["code","product_name","brands","quantity","image_front_small_url","image_front_url","ingredients_text","nutriscore_grade","nutriments"].join(",");function Ae(e){const t=e.nutriments||{};return{id:e.code,name:(e.product_name||"").trim(),brand:(e.brands||"").split(",")[0].trim(),quantity:e.quantity||"",thumb:e.image_front_small_url||"",image:e.image_front_url||e.image_front_small_url||"",ingredients:e.ingredients_text||"",nutriscore:(e.nutriscore_grade||"").toLowerCase(),nutrition:{energy:t["energy-kcal_100g"],fat:t.fat_100g,saturatedFat:t["saturated-fat_100g"],carbs:t.carbohydrates_100g,sugars:t.sugars_100g,protein:t.proteins_100g,salt:t.salt_100g}}}async function Pe(e){const t=new URLSearchParams({search_terms:e,search_simple:"1",action:"process",json:"1",page_size:String(Ie),fields:Ce});return((await w(`${Re}/cgi/search.pl?${t}`,{timeout:2e4})).products||[]).map(Ae).filter(r=>r.name)}const He=[["energy","Energy","kcal"],["fat","Fat","g"],["saturatedFat","Saturated fat","g"],["carbs","Carbohydrates","g"],["sugars","Sugars","g"],["protein","Protein","g"],["salt","Salt","g"]];function _e(e){return typeof e=="number"?String(Math.round(e*10)/10):"—"}function Be(e,t){return`<article class="card product-card" style="--i:${t}">
    ${e.thumb?`<img src="${s(e.thumb)}" alt="${s(e.name)} package" loading="lazy" width="200" height="200" />`:'<div class="no-image" aria-hidden="true">No image</div>'}
    <div class="card-body">
      <h3>${s(e.name)}</h3>
      <p class="muted">${s([e.brand,e.quantity].filter(Boolean).join(" · ")||"Brand unknown")}</p>
      ${e.nutriscore&&/^[a-e]$/.test(e.nutriscore)?`<p><span class="nutri nutri-${e.nutriscore}">Nutri-Score ${e.nutriscore.toUpperCase()}</span></p>`:""}
      <button type="button" class="btn btn-small btn-primary" data-details="${s(e.id)}">View details</button>
    </div>
  </article>`}function xe(e){return`
    <h2 id="dlg-title">${s(e.name)}</h2>
    <p class="muted">${s([e.brand,e.quantity].filter(Boolean).join(" · "))}</p>
    ${e.image?`<img class="dlg-img" src="${s(e.image)}" alt="${s(e.name)} package" />`:""}
    <h3>Ingredients</h3>
    <p>${e.ingredients?s(e.ingredients):"Ingredient information is not available for this product."}</p>
    <h3>Nutrition per 100 g</h3>
    <table class="nutrition">
      <caption class="visually-hidden">Nutritional values per 100 grams</caption>
      <thead><tr><th scope="col">Nutrient</th><th scope="col">Amount</th></tr></thead>
      <tbody>${He.map(([t,n,r])=>`<tr><th scope="row">${n}</th><td>${_e(e.nutrition[t])}${typeof e.nutrition[t]=="number"?` ${r}`:""}</td></tr>`).join("")}</tbody>
    </table>
    <div class="toolbar">
      <button type="button" class="btn btn-primary" data-add-product>Add to shopping list</button>
      <button type="button" class="btn btn-outline" data-close>Close</button>
    </div>`}async function Fe({query:e,outlet:t,isCurrent:n}){const r=(e.get("q")||"").trim();document.title="Food Products · Recipe & Meal Planner",t.innerHTML=`
    <h1>Food product information</h1>
    <p>Look up packaged foods to see their ingredients and nutrition facts.</p>
    <form class="search-form" role="search" id="product-form">
      <div class="field">
        <label for="product-q">Product name</label>
        <input id="product-q" name="q" type="search" required minlength="2"
          placeholder="e.g. peanut butter, tomato sauce" value="${s(r)}" />
      </div>
      <button type="submit" class="btn btn-primary">Search products</button>
    </form>
    <div id="product-results" aria-live="polite"></div>
    <dialog id="product-dialog" aria-labelledby="dlg-title"></dialog>`,t.querySelector("#product-form").addEventListener("submit",o=>{o.preventDefault();const c=String(new FormData(o.currentTarget).get("q")).trim();c&&(window.location.hash=`#/products?q=${encodeURIComponent(c)}`)});const a=t.querySelector("#product-results");if(!r){a.innerHTML=g("Search for a product","Results come from Open Food Facts.");return}async function i(){a.innerHTML=y(`Searching products for "${r}"… this can take a few seconds.`);try{const o=await Pe(r);if(!n())return;if(o.length===0){a.innerHTML=g(`No products found for "${r}"`,"Try a more general name.");return}a.innerHTML=`<div class="grid grid-wide">${o.map(Be).join("")}</div>`;const c=t.querySelector("#product-dialog");a.addEventListener("click",d=>{const p=d.target.closest("[data-details]");if(!p)return;const m=o.find(l=>l.id===p.dataset.details);m&&(c.innerHTML=xe(m),c.querySelector("[data-close]").addEventListener("click",()=>c.close()),c.querySelector("[data-add-product]").addEventListener("click",()=>{const l=[m.brand,m.name].filter(Boolean).join(" ");R({name:l,measure:m.quantity}),b(`Added ${m.name} to your list`)}),c.showModal())}),c.addEventListener("click",d=>{d.target===c&&c.close()})}catch(o){if(!n())return;a.innerHTML=$(o.message),q(a,i)}}await i()}function je({outlet:e}){document.title="Page not found · Recipe & Meal Planner",e.innerHTML=`
    <h1>Page not found</h1>
    <div class="state"><p>That page does not exist.</p>
    <p><a class="btn btn-primary" href="#/">Go home</a></p></div>`}f("/",_);f("/search",ye);f("/categories",$e);f("/categories/:name",ve);f("/recipe/:id",ke);f("/favorites",Me);f("/planner",Te);f("/shopping",Ee);f("/products",Fe);function N(e,t){const n=document.getElementById(e);n.textContent=t,n.hidden=t===0}function Q(){N("fav-count",S().length),N("shop-count",v().filter(e=>!e.checked).length)}window.addEventListener("app:storage",Q);Q();const E=document.querySelector(".nav-toggle"),B=document.getElementById("site-nav");E.addEventListener("click",()=>{const e=E.getAttribute("aria-expanded")==="true";E.setAttribute("aria-expanded",String(!e)),B.classList.toggle("is-open",!e)});B.addEventListener("click",e=>{e.target.closest("a")&&(E.setAttribute("aria-expanded","false"),B.classList.remove("is-open"))});te(document.getElementById("app"),je);
