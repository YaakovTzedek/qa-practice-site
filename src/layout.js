import './styles.css';
import { FIXES } from './fixes.js';
import { cartCount } from './cart.js';

const NAV = [
  { href: '/', label: 'בית', key: 'home' },
  { href: '/#work', label: 'עבודות', key: 'work' },
  { href: '/shop', label: 'חנות', key: 'shop' },
  { href: '/pricing', label: 'מחירון', key: 'pricing', fix: 'pricingInMenu' },
  { href: '/contact', label: 'צור קשר', key: 'contact' },
];

function header(active) {
  const links = NAV.filter((l) => !l.fix || FIXES[l.fix])
    .map((l) => `<a href="${l.href}"${l.key === active ? ' aria-current="page"' : ''}>${l.label}</a>`)
    .join('');
  return `
  <header class="site-header">
    <div class="wrap header-row">
      <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">נ</span><span>סטודיו נועה<small>עיצוב לעסקים קטנים</small></span></a>
      <nav class="main-nav" aria-label="ניווט ראשי">${links}</nav>
      <a class="cart-link" href="/cart" aria-label="סל הקניות">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5.2 4l.4 2H21l-2 8H7.4l.4 2H19v2H6.2L3.6 4H2V2h3.2l.4 2Z"/></svg>
        <span class="cart-count" data-cart-count>0</span>
      </a>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <strong>סטודיו נועה לעיצוב</strong>
        <p>מיתוג, לוגו ותבניות לרשתות לעסקים קטנים. עובדים מתל אביב עם לקוחות מכל הארץ.</p>
      </div>
      <div>
        <strong>ניווט</strong>
        <ul><li><a href="/shop">חנות</a></li><li><a href="/pricing">מחירון</a></li><li><a href="/contact">קביעת שיחת היכרות</a></li></ul>
      </div>
      <div>
        <strong>יצירת קשר</strong>
        <p>studio@example.com<br>ימים א׳ עד ה׳, 9:00 עד 17:00</p>
      </div>
    </div>
    <p class="wrap demo-note">אתר הדגמה לתרגול בדיקות איכות. העסק בדיוני, ואף תשלום לא מתבצע באתר.</p>
  </footer>`;
}

function cookieBanner() {
  let consent = null;
  try {
    consent = localStorage.getItem('noa-cookies');
  } catch {}
  if (consent) return;
  const el = document.createElement('div');
  el.className = 'cookie-banner';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'הודעת עוגיות');
  el.innerHTML = `
    <p><strong>עוגיות באתר</strong><br>אנחנו משתמשים בעוגיות כדי שהאתר יעבוד כמו שצריך, כדי לזכור את סל הקניות שלך וכדי למדוד אילו מודעות הביאו אותך אלינו. אפשר לאשר הכל או להסתפק בעוגיות ההכרחיות בלבד.</p>
    <div class="cookie-actions">
      <button type="button" class="btn btn-primary" data-consent="all">מאשר/ת הכל</button>
      <button type="button" class="btn btn-ghost" data-consent="necessary">רק הכרחיות</button>
    </div>`;
  document.body.appendChild(el);

  const syncOffset = () => {
    // Fixed version: reserve room so sticky buttons sit above the banner.
    if (FIXES.cookieBanner) document.body.style.setProperty('--cookie-h', `${el.offsetHeight}px`);
  };
  syncOffset();
  window.addEventListener('resize', syncOffset);

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-consent]');
    if (!btn) return;
    try {
      localStorage.setItem('noa-cookies', btn.dataset.consent);
    } catch {}
    el.remove();
    document.body.style.removeProperty('--cookie-h');
  });
}

export function updateCartCount() {
  document.querySelectorAll('[data-cart-count]').forEach((n) => {
    n.textContent = String(cartCount());
  });
}

export function mount(active, mainHtml) {
  const app = document.getElementById('app');
  app.innerHTML = `${header(active)}<main id="main">${mainHtml}</main>${footer()}`;
  updateCartCount();
  document.addEventListener('cart:change', updateCartCount);
  cookieBanner();
  return app;
}
