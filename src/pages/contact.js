import { mount } from '../layout.js';
import { FIXES } from '../fixes.js';

const a11y = FIXES.accessibility;

// Bug version: placeholder only, no <label>. Fixed version: a real label tied to each field.
function field(id, label, control) {
  if (!a11y) return `<div class="field">${control.replace('%ID%', '')}</div>`;
  return `<div class="field"><label for="${id}">${label}</label>${control.replace('%ID%', `id="${id}"`)}</div>`;
}

const today = new Date().toISOString().slice(0, 10);

mount('contact', `
<section class="section">
  <div class="wrap checkout-grid">
    <div>
      <p class="eyebrow">צור קשר</p>
      <h1>נקבע שיחת היכרות של 20 דקות</h1>
      <p class="muted">משאירים פרטים, בוחרים מועד שנוח לך, ואנחנו מאשרים את השיחה במייל תוך יום עבודה.</p>
      <form class="form card" id="contact-form" novalidate>
        <div class="row">
          ${field('c-name', 'שם מלא', '<input %ID% name="name" type="text" placeholder="שם מלא" autocomplete="name" required>')}
          ${field('c-phone', 'טלפון', '<input %ID% name="phone" type="tel" placeholder="טלפון" autocomplete="tel" required>')}
        </div>
        ${field('c-email', 'אימייל', '<input %ID% name="email" type="email" placeholder="אימייל" autocomplete="email" required>')}
        <div class="row">
          ${field('c-service', 'במה אפשר לעזור', `<select %ID% name="service"><option value="">במה אפשר לעזור?</option><option>עיצוב לוגו</option><option>חבילת מיתוג מלאה</option><option>תבניות לאינסטגרם</option><option>עוד לא בטוח/ה</option></select>`)}
          ${field('c-date', 'מועד מועדף לשיחה', `<input %ID% name="date" type="date" min="${today}" required>`)}
        </div>
        ${field('c-msg', 'ספרו לנו על העסק', '<textarea %ID% name="message" rows="4" placeholder="ספרו לנו בקצרה על העסק"></textarea>')}
        <p class="notice" id="c-err" hidden>צריך למלא שם, טלפון, אימייל ומועד.</p>
        <button class="btn btn-primary" type="submit">לקביעת השיחה</button>
      </form>
    </div>
    <aside class="card">
      <h2 style="font-size:1.3rem">מה קורה בשיחה?</h2>
      <ul class="checklist">
        <li>מבינים מה העסק עושה ולמי הוא פונה</li>
        <li>עוברים על דוגמאות שאהבת</li>
        <li>מקבלים הצעת מחיר סגורה</li>
      </ul>
      <p class="muted" style="margin-top:16px">מעדיפים מייל? studio@example.com</p>
    </aside>
  </div>
</section>`);

document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const need = ['name', 'phone', 'email', 'date'];
  const ok = need.every((n) => f.elements[n].value.trim());
  document.getElementById('c-err').hidden = ok;
  if (!ok) return;
  // Practice site: nothing is sent anywhere.
  const first = f.elements.name.value.trim().split(' ')[0];
  f.outerHTML = `<div class="success" id="contact-done"><h2>תודה ${first}!</h2><p>קיבלנו את הבקשה. אישור לשיחה יגיע למייל תוך יום עבודה.</p></div>`;
});
