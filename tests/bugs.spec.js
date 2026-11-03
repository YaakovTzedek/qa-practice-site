// Checks every planted bug.
//   npm run test:bugs   site as shipped: every test asserts the bug is present
//   npm run test:fixed  build with VITE_FIXES=all: every test asserts the fix
// When only some flags are on, run with EXPECT_FIXED=<flag,flag> to say which tests expect the fix.
import { test, expect } from '@playwright/test';

const env = String(process.env.EXPECT_FIXED || process.env.VITE_FIXES || '')
  .split(',')
  .map((s) => s.trim());
const fixed = (flag) => env.includes('all') || env.includes(flag);

const PHONE = { width: 390, height: 844 };

async function seed(page, { cart, consent = true } = {}) {
  await page.addInitScript(
    ([cartJson, consent]) => {
      if (sessionStorage.getItem('seeded')) return;
      if (consent) localStorage.setItem('noa-cookies', 'all');
      if (cartJson) localStorage.setItem('noa-cart', cartJson);
      sessionStorage.setItem('seeded', '1');
    },
    [cart ? JSON.stringify(cart) : null, consent],
  );
}

/** True when a real tap at the center of the element would land on that element. */
async function tapReaches(page, selector) {
  return page.$eval(selector, (el) => {
    const r = el.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return hit === el || el.contains(hit);
  });
}

test.describe('phone', () => {
  test.use({ viewport: PHONE, isMobile: true, hasTouch: true });

  test('1. cookie banner covers "add to cart" on a phone', async ({ page }) => {
    await page.goto('/product?id=branding');
    await expect(page.locator('.cookie-banner')).toBeVisible();
    await page.locator('#add-to-cart').scrollIntoViewIfNeeded();
    expect(await tapReaches(page, '#add-to-cart')).toBe(fixed('cookieBanner'));
  });

  test('9. hero button is dead on a phone', async ({ page }) => {
    await seed(page);
    await page.goto('/');
    expect(await tapReaches(page, '#hero-cta')).toBe(fixed('mobileButton'));
    const box = await page.locator('#hero-cta').boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(800);
    if (fixed('mobileButton')) await expect(page).toHaveURL(/\/contact/);
    else expect(new URL(page.url()).pathname).toBe('/');
  });
});

test('2. ad price differs from the product page price', async ({ page }) => {
  await seed(page);
  await page.goto('/offer?utm_source=instagram&utm_medium=paid&utm_campaign=branding');
  const adPrice = (await page.locator('[data-offer-price]').innerText()).trim();
  await page.goto('/product?id=branding');
  const productPrice = (await page.locator('[data-product-price]').innerText()).trim();
  if (fixed('adPrice')) expect(productPrice).toBe(adPrice);
  else expect(productPrice).not.toBe(adPrice);
});

test('3. the add-on lands in the cart twice', async ({ page }) => {
  await seed(page);
  await page.goto('/product?id=branding');
  await page.locator('#addon').check();
  await page.locator('#add-to-cart').click();
  const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('noa-cart') || '[]'));
  const addon = cart.find((l) => l.id === 'source-files');
  expect(addon?.qty).toBe(fixed('addonOnce') ? 1 : 2);
});

test('4. total with VAT is wrong', async ({ page }) => {
  await seed(page, { cart: [{ id: 'logo', qty: 1 }] });
  await page.goto('/cart');
  const subtotal = Number(await page.locator('[data-subtotal]').getAttribute('data-subtotal'));
  const total = Number(await page.locator('[data-total]').getAttribute('data-total'));
  const expected = Math.round(subtotal * 1.18);
  if (fixed('vatTotal')) expect(total).toBe(expected);
  else expect(total).not.toBe(expected);
});

test('5. hero image is too heavy', async ({ page }) => {
  await seed(page);
  const sizes = [];
  page.on('response', async (res) => {
    if (res.url().includes('/img/hero-studio')) sizes.push((await res.body()).length);
  });
  await page.goto('/', { waitUntil: 'load' });
  await expect.poll(() => sizes.length).toBeGreaterThan(0);
  const bytes = Math.max(...sizes);
  if (fixed('heroImage')) expect(bytes).toBeLessThan(300_000);
  else expect(bytes).toBeGreaterThan(1_000_000);
});

test('6. pricing is missing from the menu', async ({ page }) => {
  await seed(page);
  await page.goto('/');
  await expect(page.locator('.main-nav a[href="/pricing"]')).toHaveCount(fixed('pricingInMenu') ? 1 : 0);
});

test('7. unlabeled form fields and images without alt', async ({ page }) => {
  await seed(page);
  let noAlt = 0;
  for (const path of ['/', '/shop', '/offer', '/product?id=logo']) {
    await page.goto(path);
    noAlt += await page.locator('main img:not([alt])').count();
  }
  await page.goto('/contact');
  const unlabeled = await page.$$eval('#contact-form input, #contact-form select, #contact-form textarea', (els) =>
    els.filter((el) => !(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')).length,
  );
  if (fixed('accessibility')) {
    expect(noAlt).toBe(0);
    expect(unlabeled).toBe(0);
  } else {
    expect(noAlt).toBeGreaterThan(0);
    expect(unlabeled).toBeGreaterThan(0);
  }
});

test('8. an image returns 404', async ({ page }) => {
  await seed(page);
  await page.goto('/');
  const statuses = await page.$$eval('img', (imgs) =>
    Promise.all(imgs.map((i) => fetch(i.getAttribute('src'), { method: 'HEAD' }).then((r) => [i.getAttribute('src'), r.status]))),
  );
  const broken = statuses.filter(([, s]) => s === 404);
  if (fixed('brokenImage')) expect(broken).toEqual([]);
  else expect(broken.length).toBeGreaterThan(0);
});

test('10. Hebrew ad landing leads to an English checkout', async ({ page }) => {
  await seed(page);
  await page.goto('/offer?utm_source=instagram&utm_medium=paid');
  await expect(page.locator('html')).toHaveAttribute('lang', 'he');
  await page.locator('#offer-buy').click();
  await page.waitForURL(/\/checkout/);
  await expect(page.locator('html')).toHaveAttribute('lang', fixed('checkoutLanguage') ? 'he' : 'en');
});

test('smoke: checkout ends on a fake payment and sends nothing', async ({ page }) => {
  await seed(page, { cart: [{ id: 'social', qty: 1 }] });
  const posts = [];
  page.on('request', (req) => {
    if (req.method() !== 'GET' && req.method() !== 'HEAD') posts.push(req.url());
  });
  await page.goto('/checkout');
  await page.locator('#fullname').fill('Test Buyer');
  await page.locator('#email').fill('buyer@example.com');
  await page.locator('#phone').fill('0500000000');
  await page.locator('#details button[type=submit]').click();
  await page.locator('#card').fill('4242 4242 4242 4242');
  await page.locator('#exp').fill('12/30');
  await page.locator('#cvv').fill('123');
  await page.locator('#pay').click();
  await expect(page.locator('#order-done')).toBeVisible();
  expect(posts).toEqual([]);
});
