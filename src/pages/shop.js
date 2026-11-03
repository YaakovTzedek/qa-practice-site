import { mount } from '../layout.js';
import { FIXES } from '../fixes.js';
import { PRODUCTS, ils } from '../data.js';

const alt = (t) => (FIXES.accessibility ? ` alt="${t}"` : '');

mount('shop', `
<section class="section">
  <div class="wrap">
    <p class="eyebrow">החנות</p>
    <h1>מזמינים אונליין, מתחילים השבוע</h1>
    <p class="muted" style="max-width:60ch">כל המחירים לפני מע״מ. אחרי ההזמנה נחזור אליך תוך יום עבודה לתיאום שיחת פתיחה.</p>
    <div class="grid-3" style="margin-top:28px">
      ${PRODUCTS.map((p) => `
        <article class="card product-card">
          <img src="${p.image}"${alt(p.alt)}>
          <div class="body">
            <h2 style="font-size:1.3rem;margin:0">${p.name}</h2>
            <p class="muted">${p.short}</p>
            <span class="price" data-price="${p.id}">${ils(p.price)} <small class="muted">+ מע״מ</small></span>
            <a class="btn btn-primary" href="/product?id=${p.id}">לפרטים ולהזמנה</a>
          </div>
        </article>`).join('')}
    </div>
  </div>
</section>
`);
