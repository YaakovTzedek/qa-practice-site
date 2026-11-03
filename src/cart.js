import { findItem } from './data.js';
import { FIXES } from './fixes.js';

const KEY = 'noa-cart';

export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function save(cart) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
  } catch {}
  document.dispatchEvent(new CustomEvent('cart:change'));
}

export function addToCart(id, qty = 1) {
  const cart = readCart();
  const line = cart.find((l) => l.id === id);
  if (line) line.qty += qty;
  else cart.push({ id, qty });
  save(cart);
}

export function setQty(id, qty) {
  const cart = readCart()
    .map((l) => (l.id === id ? { ...l, qty } : l))
    .filter((l) => l.qty > 0);
  save(cart);
}

export function clearCart() {
  save([]);
}

export function cartLines() {
  return readCart()
    .map((l) => ({ ...l, item: findItem(l.id) }))
    .filter((l) => l.item);
}

export function cartCount() {
  return readCart().reduce((n, l) => n + l.qty, 0);
}

export function totals() {
  const subtotal = cartLines().reduce((s, l) => s + l.item.price * l.qty, 0);
  // The label says 18%. The math still uses the old rate.
  const rate = FIXES.vatTotal ? 0.18 : 0.17;
  const vat = Math.round(subtotal * rate);
  return { subtotal, vat, total: subtotal + vat };
}
