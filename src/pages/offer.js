import { mount } from '../layout.js';
import { FIXES } from '../fixes.js';
import { OFFER_PRICE, PRODUCTS, ils } from '../data.js';
import { addToCart, clearCart } from '../cart.js';

const params = new URLSearchParams(location.search);
const utm = {};
for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
  if (params.get(k)) utm[k] = params.get(k);
}
try {
  if (Object.keys(utm).length) sessionStorage.setItem('noa-utm', JSON.stringify(utm));
} catch {}

const SOURCES = { instagram: 'Instagram', ig: 'Instagram', facebook: 'Facebook', fb: 'Facebook', google: 'Google', tiktok: 'TikTok' };
const source = SOURCES[String(utm.utm_source || '').toLowerCase()];
const branding = PRODUCTS.find((p) => p.id === 'branding');
const alt = FIXES.accessibility ? ` alt="${branding.alt}"` : '';

mount('offer', `
${source ? `<div class="utm-strip">ההטבה למגיעים מ־${source} שמורה לך עד סוף החודש</div>` : ''}
<section class="offer-hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow" style="color:var(--accent)">מבצע לזמן מוגבל</p>
      <h1>חבילת מיתוג מלאה לעסק שלך</h1>
      <p class="lead">לוגו, צבעים, גופנים וספר מותג. כל מה שצריך כדי שהעסק ייראה מקצועי בכל מקום שבו לקוחות פוגשים אותו.</p>
      <div class="price-tag"><span class="now" data-offer-price>${ils(OFFER_PRICE)}</span><s>${ils(branding.compareAt)}</s><span class="muted">+ מע״מ</span></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary" type="button" id="offer-buy">להזמנה במחיר המבצע</button>
        <a class="btn btn-light" href="/product?id=branding">מה כלול בחבילה</a>
      </div>
    </div>
    <div class="hero-media"><img src="${branding.image}"${alt}></div>
  </div>
</section>

<section class="section">
  <div class="wrap grid-3">
    <div class="card"><h3>מה מקבלים</h3><ul class="checklist">${branding.bullets.map((b) => `<li>${b}</li>`).join('')}</ul></div>
    <div class="card"><h3>למי זה מתאים</h3><p class="muted">עסקים שנפתחו בשנה האחרונה, או עסקים ותיקים שהלוגו שלהם כבר לא מייצג אותם.</p></div>
    <div class="card"><h3>בלי הפתעות</h3><p class="muted">המחיר סגור מראש, כולל שני סבבי תיקונים. משלמים רק אחרי שיחת תיאום.</p></div>
  </div>
</section>
`);

document.getElementById('offer-buy').addEventListener('click', () => {
  clearCart();
  addToCart('branding');
  location.href = '/checkout';
});
