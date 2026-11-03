import { FIXES } from './fixes.js';

export const VAT_RATE = 0.18;

// The campaign price that the ad and the /offer page promise.
export const OFFER_PRICE = 1990;

export const PRODUCTS = [
  {
    id: 'logo',
    name: 'עיצוב לוגו',
    short: 'לוגו מקורי עם שלוש הצעות כיוון ושני סבבי תיקונים.',
    price: 890,
    image: '/img/product-logo.jpg',
    alt: 'איור מופשט בגווני כחול וכתום שמייצג עיצוב לוגו',
    addon: true,
    bullets: ['שלוש הצעות כיוון ראשוניות', 'שני סבבי תיקונים', 'קבצים לדפוס ולרשת', 'מסירה תוך 10 ימי עבודה'],
  },
  {
    id: 'branding',
    name: 'חבילת מיתוג מלאה',
    short: 'לוגו, פלטת צבעים, טיפוגרפיה וספר מותג קצר שאפשר לעבוד איתו מחר בבוקר.',
    // The store price was never updated to the campaign price.
    price: FIXES.adPrice ? OFFER_PRICE : 2490,
    compareAt: 2490,
    image: '/img/product-branding.jpg',
    alt: 'איור מופשט בגווני סגול ואפרסק שמייצג חבילת מיתוג',
    addon: true,
    bullets: ['עיצוב לוגו מלא', 'פלטת צבעים ושני גופנים', 'ספר מותג של 12 עמודים', 'כרטיס ביקור ותמונת פרופיל', 'מסירה תוך 3 שבועות'],
  },
  {
    id: 'social',
    name: 'ערכת תבניות לאינסטגרם',
    short: '20 תבניות פוסט וסטורי בצבעי המותג שלך, מוכנות לעריכה ב־Canva.',
    price: 390,
    image: '/img/product-social.jpg',
    alt: 'איור מופשט בגווני ירוק זית וחום שמייצג ערכת תבניות לרשתות',
    addon: false,
    bullets: ['12 תבניות פוסט', '8 תבניות סטורי', 'התאמה לצבעים ולגופנים שלך', 'קישור עריכה ב־Canva'],
  },
];

export const ADDON = {
  id: 'source-files',
  name: 'תוספת: קבצי מקור פתוחים',
  price: 150,
};

export function findItem(id) {
  return PRODUCTS.find((p) => p.id === id) || (id === ADDON.id ? ADDON : null);
}

export const ils = (n) => `${Math.round(n).toLocaleString('en-US')} ₪`;
