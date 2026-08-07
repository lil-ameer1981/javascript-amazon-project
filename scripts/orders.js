import { addToCart, getCartQuantity } from '../data/cart.js';
import { orders } from '../data/orders.js';
import { products } from '../data/products.js';

const formatMoney = (cents) => `$${(cents / 100).toFixed(2)}`;
const formatDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(date));
const getProduct = (productId) => products.find((product) => product.id === productId);

document.querySelector('.cart-quantity').textContent = getCartQuantity();

function searchProducts() {
  const term = document.querySelector('.search-bar').value.trim();
  window.location.href = `amazon.html?search=${encodeURIComponent(term)}`;
}
document.querySelector('.search-button').addEventListener('click', searchProducts);
document.querySelector('.search-bar').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') searchProducts();
});

const placedOrderId = new URLSearchParams(window.location.search).get('placed');
if (placedOrderId) document.querySelector('.order-placed-message').textContent = `Order placed successfully. Your order ID is ${placedOrderId}.`;

const ordersGrid = document.querySelector('.orders-grid');
ordersGrid.innerHTML = orders.length ? orders.map((order) => `
  <section class="order-container">
    <div class="order-header">
      <div class="order-header-left-section"><div class="order-date"><div class="order-header-label">Order Placed:</div><div>${formatDate(order.placedAt)}</div></div><div class="order-total"><div class="order-header-label">Total:</div><div>${formatMoney(order.totalCents)}</div></div></div>
      <div class="order-header-right-section"><div class="order-header-label">Order ID:</div><div>${order.id}</div></div>
    </div>
    <div class="order-details-grid">
      ${order.products.map((orderProduct) => {
        const product = getProduct(orderProduct.productId);
        return `<div class="order-product-row"><div class="product-image-container"><img src="${product.image}" alt="${product.name}"></div><div class="product-details"><div class="product-name">${product.name}</div><div class="product-delivery-date">${orderProduct.status === 'Delivered' ? 'Delivered' : `Arriving on: ${formatDate(orderProduct.deliveryDate)}`}</div><div class="product-quantity">Quantity: ${orderProduct.quantity}</div><button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}" data-quantity="${orderProduct.quantity}"><img class="buy-again-icon" src="images/icons/buy-again.png" alt=""><span>Buy it again</span></button></div><div class="product-actions"><a class="track-package-button button-secondary" href="tracking.html?orderId=${order.id}&productId=${product.id}">Track package</a></div></div>`;
      }).join('')}
    </div>
  </section>`).join('') : '<div class="empty-message">You have not placed any orders yet. <a class="link-primary" href="amazon.html">Start shopping</a></div>';

document.querySelectorAll('.js-buy-again').forEach((button) => button.addEventListener('click', () => {
  addToCart(button.dataset.productId, Number(button.dataset.quantity));
  document.querySelector('.cart-quantity').textContent = getCartQuantity();
  button.querySelector('span').textContent = 'Added to cart';
}));
