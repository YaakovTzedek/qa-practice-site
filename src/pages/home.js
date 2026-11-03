import { mount } from '../layout.js';
import { FIXES } from '../fixes.js';
import { PRODUCTS, ils } from '../data.js';

const a11y = FIXES.accessibility;
const alt = (text) => (a11y ? ` alt="${text}"` : '');

const hero = FIXES.heroImage
  ? `<img src="/img/hero-studio-1600.webp" srcset="/img/hero-studio-800.webp 800w, /img/hero-studio-1600.webp 1600w" sizes="(max-width: 860px) 100vw, 50vw" width="1600" height="1028" fetchpriority="high"${alt('קומפוזיציה גרפית בצבעי הסטודיו: עיגולים בכתום וכחול כהה על רקע שמנת')}>`
  : `<img src="/img/hero-studio.jpg"${alt('קומפוזיציה גרפית בצבעי הסטודיו: עיגולים בכתום וכחול כהה על רקע שמנת')}>`;

const works = [
  { src: '/img/portfolio-1.jpg', text: 'מיתוג לבית קפה שכונתי' },
  { src: '/img/portfolio-2.jpg', text: 'לוגו לסטודיו פילאטיס' },
  // The file on disk is portfolio-3.jpg.
  { src: FIXES.brokenImage ? '/img/portfolio-3.jpg' : '/img/portfolio-3.jpeg', text: 'ערכת תבניות לחנות פרחים' },
  { src: '/img/portfolio-4.jpg', text: 'ספר מותג למשרד אדריכלים' },
];

mount('home', `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">סטודיו לעיצוב לעסקים קטנים</p>
      <h1>עיצוב שגורם לעסק שלך להיראות כמו שהוא באמת</h1>
      <p class="lead">מיתוג, לוגו ותבניות לרשתות. מחיר ידוע מראש, שני סבבי תיקונים, ותוצר שאפשר לעבוד איתו מהיום הראשון.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/contact" id="hero-cta">לקביעת שיחת היכרות</a>
        <a class="btn btn-ghost" href="/shop">לחנות</a>
        <span class="hero-deco${FIXES.mobileButton ? ' is-inert' : ''}" aria-hidden="true"></span>
      </div>
      <div class="trust"><span>מעל 140 עסקים מותגו אצלנו</span><span>מסירה בזמן או החזר</span></div>
    </div>
    <div class="hero-media">${hero}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">מה אפשר להזמין</p>
    <h2>שלושה מוצרים, בלי חבילות מסובכות</h2>
    <div class="grid-3">
      ${PRODUCTS.map((p) => `
        <article class="card product-card">
          <img src="${p.image}" loading="lazy"${alt(p.alt)}>
          <div class="body">
            <h3>${p.name}</h3>
            <p class="muted">${p.short}</p>
            <span class="price">${ils(p.price)} <small class="muted">+ מע״מ</small></span>
            <a class="btn btn-ghost" href="/product?id=${p.id}">לפרטים</a>
          </div>
        </article>`).join('')}
    </div>
  </div>
</section>

<section class="section" id="work">
  <div class="wrap">
    <p class="eyebrow">עבודות אחרונות</p>
    <h2>מה יצא לנו לאחרונה</h2>
    <div class="grid-4">
      ${works.map((w) => `<figure class="work" style="margin:0"><img src="${w.src}" loading="lazy" width="800" height="800"${alt(w.text)}><figcaption class="muted">${w.text}</figcaption></figure>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">איך זה עובד</p>
    <h2>שלושה שלבים עד למותג מוכן</h2>
    <div class="grid-3 steps">
      <div class="card"><h3>שיחת היכרות</h3><p class="muted">20 דקות בזום או בטלפון. מבינים מה העסק צריך ומה התקציב.</p></div>
      <div class="card"><h3>הצעות כיוון</h3><p class="muted">תוך שבוע מקבלים שלוש הצעות ובוחרים אחת להמשך.</p></div>
      <div class="card"><h3>מסירה</h3><p class="muted">אחרי שני סבבי תיקונים מקבלים את כל הקבצים, מסודרים ומוכנים לשימוש.</p></div>
    </div>
  </div>
</section>

<section class="wrap">
  <div class="band">
    <div><h2 style="margin:0">רוצים לראות אם זה מתאים?</h2><p style="margin:.4em 0 0">שיחת היכרות קצרה, בלי עלות ובלי התחייבות.</p></div>
    <a class="btn btn-light" href="/contact">לקביעת שיחה</a>
  </div>
</section>
`);
