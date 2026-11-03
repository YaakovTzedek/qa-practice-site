// Practice switches. false = the planted bug is live. true = the fixed version.
// Flip one flag here and rebuild, or set VITE_FIXES at build time:
//   VITE_FIXES=all              every fix on
//   VITE_FIXES=vatTotal,adPrice only these fixes on
// The answer key for every flag is in BUGS.md.
export const FIXES = {
  cookieBanner: false, // 1
  adPrice: false, // 2
  addonOnce: false, // 3
  vatTotal: false, // 4
  heroImage: false, // 5
  pricingInMenu: false, // 6
  accessibility: false, // 7
  brokenImage: false, // 8
  mobileButton: false, // 9
  checkoutLanguage: false, // 10
};

const fromEnv = String(import.meta.env.VITE_FIXES || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

for (const key of Object.keys(FIXES)) {
  if (fromEnv.includes('all') || fromEnv.includes(key)) FIXES[key] = true;
}
