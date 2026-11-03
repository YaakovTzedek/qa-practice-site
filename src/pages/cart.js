import { mount } from '../layout.js';
import { cartLines, setQty, totals } from '../cart.js';
import { ils } from '../data.js';

mount('cart', `
<section class="section">
  <div class="wrap">
    <h1>סל הקניות</h1>
    <div id="cart-body"></div>
  </div>
</section>`);

function render() {
  const lines = cartLines();
  const body = document.getElementById('cart-body');
  if (!lines.length) {
    body.innerHTML = `<p class="muted">הסל ריק כרגע.</p><a class="btn btn-primary" href="/shop">לחנות</a>`;
    return;
  }
  const t = totals();
  body.innerHTML = `
    <table class="cart-table">
      <thead><tr><th>מוצר</th><th>מחיר</th><th>כמות</th><th>סה״כ</th></tr></thead>
      <tbody>
        ${lines.map((l) => `
          <tr data-line="${l.id}">
            <td>${l.item.name}</td>
            <td>${ils(l.item.price)}</td>
            <td><span class="qty"><button type="button" data-dec="${l.id}" aria-label="הפחתת כמות">−</button><span data-qty="${l.id}">${l.qty}</span><button type="button" data-inc="${l.id}" aria-label="הוספת כמות">+</button></span></td>
            <td>${ils(l.item.price * l.qty)}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <div class="summary">
      <div><span>סכום ביניים</span><span data-subtotal="${t.subtotal}">${ils(t.subtotal)}</span></div>
      <div><span>מע״מ 18%</span><span data-vat="${t.vat}">${ils(t.vat)}</span></div>
      <div class="grand"><span>סה״כ לתשלום</span><span data-total="${t.total}">${ils(t.total)}</span></div>
      <a class="btn btn-primary btn-block" href="/checkout">למעבר לתשלום</a>
    </div>`;
}

document.addEventListener('click', (e) => {
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  if (!inc && !dec) return;
  const lineId = (inc || dec).dataset.inc || (inc || dec).dataset.dec;
  const line = cartLines().find((l) => l.id === lineId);
  if (line) setQty(lineId, line.qty + (inc ? 1 : -1));
  render();
});

render();
