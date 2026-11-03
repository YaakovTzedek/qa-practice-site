import { mount } from '../layout.js';
import { FIXES } from '../fixes.js';
import { ADDON, PRODUCTS, ils } from '../data.js';
import { addToCart } from '../cart.js';

const id = new URLSearchParams(location.search).get('id') || 'branding';
const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[1];
document.title = `${p.name} | סטודיו נועה לעיצוב`;
const alt = FIXES.accessibility ? ` alt="${p.alt}"` : '';

mount('shop', `
<section class="section product-page">
  <div class="wrap">
    <p class="muted"><a href="/shop">חנות</a> / ${p.name}</p>
    <div class="product-layout">
      <img src="${p.image}"${alt}>
      <div>
        <h1>${p.name}</h1>
        <p class="lead muted">${p.short}</p>
        <p class="product-price"><span data-product-price>${ils(p.price)}</span> <small>+ מע״מ</small></p>
        <ul class="checklist">${p.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
        ${p.addon ? `<label class="addon"><input type="checkbox" id="addon"> <span>${ADDON.name} <strong>(+${ils(ADDON.price)})</strong><br><small class="muted">קבצי AI ו־Figma פתוחים לעריכה</small></span></label>` : ''}
        <div class="buy-bar">
          <span class="muted" data-bar-total>${ils(p.price)}</span>
          <button class="btn btn-primary" type="button" id="add-to-cart">הוספה לסל</button>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="toast" role="status" id="toast"></div>
`);

const btn = document.getElementById('add-to-cart');
const addon = document.getElementById('addon');
const toast = document.getElementById('toast');

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

function updateTotal() {
  const sum = p.price + (addon && addon.checked ? ADDON.price : 0);
  document.querySelector('[data-bar-total]').textContent = ils(sum);
}

function bindAddon() {
  btn.addEventListener('click', () => {
    if (addon && addon.checked) addToCart(ADDON.id);
  });
}

btn.addEventListener('click', () => {
  addToCart(p.id);
  showToast('נוסף לסל. אפשר להמשיך לקנות או לעבור לתשלום');
});
bindAddon();

if (addon) {
  addon.addEventListener('change', () => {
    updateTotal();
    // Bug: re-binding on every change stacks another click handler.
    if (!FIXES.addonOnce) bindAddon();
  });
}
