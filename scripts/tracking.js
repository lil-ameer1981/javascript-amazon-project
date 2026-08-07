import { getCartQuantity } from '../data/cart.js';
import { getOrder } from '../data/orders.js';
import { products } from '../data/products.js';

const params = new URLSearchParams(window.location.search);
const order = getOrder(params.get('orderId'));
const orderProduct = order?.products.find((item) => item.productId === params.get('productId'));
const product = orderProduct && products.find((item) => item.id === orderProduct.productId);
document.querySelector('.cart-quantity').textContent = getCartQuantity();

function searchProducts() {
  const term = document.querySelector('.search-bar').value.trim();
  window.location.href = `amazon.html?search=${encodeURIComponent(term)}`;
}
document.querySelector('.search-button').addEventListener('click', searchProducts);
document.querySelector('.search-bar').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') searchProducts();
});

const trackingContainer = document.querySelector('.order-tracking');
if (!order || !orderProduct || !product) {
  trackingContainer.innerHTML = '<p class="empty-message">We could not find that package. <a class="link-primary" href="orders.html">View your orders</a></p>';
} else {
  const delivered = orderProduct.status === 'Delivered';
  const status = delivered ? 'Delivered' : 'Preparing';
  const deliveryDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(orderProduct.deliveryDate));
  trackingContainer.innerHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">View all orders</a>
    <div class="delivery-date">${delivered ? 'Delivered' : `Arriving on ${deliveryDate}`}</div>
    <div class="product-info">${product.name}</div><div class="product-info">Quantity: ${orderProduct.quantity}</div>
    <img class="product-image" src="${product.image}" alt="${product.name}">
    <div class="progress-labels-container"><div class="progress-label ${status === 'Preparing' ? 'current-status' : ''}">Preparing</div><div class="progress-label ${status === 'Shipped' ? 'current-status' : ''}">Shipped</div><div class="progress-label ${status === 'Delivered' ? 'current-status' : ''}">Delivered</div></div>
    <div class="progress-bar-container"><div class="progress-bar" style="width: ${delivered ? '100' : '25'}%"></div></div>`;
}
