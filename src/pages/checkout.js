import { mount } from '../layout.js';
import { FIXES } from '../fixes.js';
import { cartLines, clearCart, totals } from '../cart.js';
import { ils } from '../data.js';

const STRINGS = {
  he: {
    title: 'השלמת הזמנה',
    step1: '1. פרטים',
    step2: '2. תשלום',
    name: 'שם מלא',
    email: 'אימייל',
    phone: 'טלפון',
    next: 'המשך לתשלום',
    card: 'מספר כרטיס',
    exp: 'תוקף (MM/YY)',
    cvv: 'CVV',
    pay: 'לתשלום',
    back: 'חזרה',
    summary: 'סיכום הזמנה',
    subtotal: 'סכום ביניים',
    vat: 'מע״מ 18%',
    total: 'סה״כ לתשלום',
    empty: 'הסל ריק. אפשר לחזור לחנות ולבחור מוצר.',
    shop: 'לחנות',
    demo: 'אתר תרגול: שום חיוב לא מתבצע ושום פרט לא נשלח. אין להזין כרטיס אמיתי. אפשר להשתמש ב־4242 4242 4242 4242.',
    required: 'צריך למלא את כל השדות',
    done: 'ההזמנה התקבלה',
    doneText: (n) => `מספר הזמנה ${n}. נחזור אליך תוך יום עבודה לתיאום שיחת פתיחה. (הדגמה בלבד, לא בוצע חיוב.)`,
  },
  en: {
    title: 'Checkout',
    step1: '1. Details',
    step2: '2. Payment',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone',
    next: 'Continue to payment',
    card: 'Card number',
    exp: 'Expiry (MM/YY)',
    cvv: 'CVV',
    pay: 'Pay now',
    back: 'Back',
    summary: 'Order summary',
    subtotal: 'Subtotal',
    vat: 'VAT 18%',
    total: 'Total',
    empty: 'Your cart is empty.',
    shop: 'Back to shop',
    demo: 'Practice site: nothing is charged and nothing is sent. Do not enter a real card. Use 4242 4242 4242 4242.',
    required: 'Please fill in all fields',
    done: 'Order received',
    doneText: (n) => `Order number ${n}. (Demo only, nothing was charged.)`,
  },
};

const lang = FIXES.checkoutLanguage ? 'he' : 'en';
const t = STRINGS[lang];
document.documentElement.lang = lang;
document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';

mount('cart', `
<section class="section">
  <div class="wrap" id="checkout" dir="${lang === 'he' ? 'rtl' : 'ltr'}">
    <h1>${t.title}</h1>
    <div id="checkout-body"></div>
  </div>
</section>`);

const body = document.getElementById('checkout-body');
const lines = cartLines();

function summary() {
  const s = totals();
  return `
    <aside class="summary" style="margin:0;max-width:none">
      <h2 style="font-size:1.2rem">${t.summary}</h2>
      ${lines.map((l) => `<div><span>${l.item.name} × ${l.qty}</span><span>${ils(l.item.price * l.qty)}</span></div>`).join('')}
      <div><span>${t.subtotal}</span><span data-subtotal="${s.subtotal}">${ils(s.subtotal)}</span></div>
      <div><span>${t.vat}</span><span data-vat="${s.vat}">${ils(s.vat)}</span></div>
      <div class="grand"><span>${t.total}</span><span data-total="${s.total}">${ils(s.total)}</span></div>
    </aside>`;
}

function field(id, label, type = 'text', extra = '') {
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${extra} required></div>`;
}

function step1() {
  body.innerHTML = `
    <div class="checkout-grid">
      <form class="form card" id="details" novalidate>
        <div class="steps-bar"><span class="on">${t.step1}</span><span>${t.step2}</span></div>
        ${field('fullname', t.name, 'text', 'autocomplete="name"')}
        <div class="row">${field('email', t.email, 'email', 'autocomplete="email"')}${field('phone', t.phone, 'tel', 'autocomplete="tel"')}</div>
        <p class="notice" id="err" hidden>${t.required}</p>
        <button class="btn btn-primary" type="submit">${t.next}</button>
      </form>
      ${summary()}
    </div>`;
  document.getElementById('details').addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = [...e.target.querySelectorAll('input')].every((i) => i.value.trim());
    document.getElementById('err').hidden = ok;
    if (ok) step2();
  });
}

function step2() {
  body.innerHTML = `
    <div class="checkout-grid">
      <form class="form card" id="payment" novalidate autocomplete="off">
        <div class="steps-bar"><span>${t.step1}</span><span class="on">${t.step2}</span></div>
        <p class="notice">${t.demo}</p>
        ${field('card', t.card, 'text', 'inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242"')}
        <div class="row">${field('exp', t.exp, 'text', 'autocomplete="off" placeholder="12/30"')}${field('cvv', t.cvv, 'text', 'inputmode="numeric" autocomplete="off" placeholder="123"')}</div>
        <p class="notice" id="err" hidden>${t.required}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-primary" type="submit" id="pay">${t.pay}</button>
          <button class="btn btn-ghost" type="button" id="back">${t.back}</button>
        </div>
      </form>
      ${summary()}
    </div>`;
  document.getElementById('back').addEventListener('click', step1);
  document.getElementById('payment').addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = [...e.target.querySelectorAll('input')];
    const ok = inputs.every((i) => i.value.trim());
    document.getElementById('err').hidden = ok;
    if (!ok) return;
    // Nothing is stored or sent anywhere. The fake "payment" ends here.
    inputs.forEach((i) => (i.value = ''));
    const order = `NOA-${Math.floor(1000 + Math.random() * 9000)}`;
    clearCart();
    body.innerHTML = `<div class="success" id="order-done"><h2>${t.done}</h2><p>${t.doneText(order)}</p><a class="btn btn-primary" href="/">${lang === 'he' ? 'לדף הבית' : 'Home'}</a></div>`;
  });
}

if (!lines.length) {
  body.innerHTML = `<p class="muted">${t.empty}</p><a class="btn btn-primary" href="/shop">${t.shop}</a>`;
} else {
  step1();
}
