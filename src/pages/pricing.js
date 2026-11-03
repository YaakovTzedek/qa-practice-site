import { mount } from '../layout.js';
import { ADDON, PRODUCTS, ils } from '../data.js';

mount('pricing', `
<section class="section">
  <div class="wrap">
    <p class="eyebrow">מחירון</p>
    <h1>כל המחירים, בלי אותיות קטנות</h1>
    <p class="muted">המחירים לפני מע״מ (18%). כל מוצר כולל שני סבבי תיקונים.</p>
    <table class="price-table" style="margin-top:20px">
      <thead><tr><th>מוצר</th><th>מה כלול</th><th>מחיר</th></tr></thead>
      <tbody>
        ${PRODUCTS.map((p) => `<tr><td><a href="/product?id=${p.id}">${p.name}</a></td><td class="muted">${p.short}</td><td><strong>${ils(p.price)}</strong></td></tr>`).join('')}
        <tr><td>${ADDON.name}</td><td class="muted">קבצי AI ו־Figma פתוחים, לכל מוצר מלבד התבניות</td><td><strong>${ils(ADDON.price)}</strong></td></tr>
      </tbody>
    </table>
    <p style="margin-top:24px"><a class="btn btn-primary" href="/contact">לא בטוחים מה מתאים? נקבע שיחה</a></p>
  </div>
</section>`);
