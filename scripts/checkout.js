import { cart, clearCart, getCartQuantity, removeFromCart, updateQuantity } from '../data/cart.js';
import { createOrder } from '../data/orders.js';
import { products } from '../data/products.js';

const deliveryOptions = [
  { id: 'standard', days: 7, priceCents: 0, label: 'FREE Shipping' },
  { id: 'express', days: 3, priceCents: 499, label: '$4.99 - Shipping' },
  { id: 'priority', days: 1, priceCents: 999, label: '$9.99 - Shipping' }
];

const formatMoney = (cents) => `$${(cents / 100).toFixed(2)}`;
const formatDate = (days) => new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  .format(new Date(Date.now() + days * 24 * 60 * 60 * 1000));
const getProduct = (productId) => products.find((product) => product.id === productId);
const getDeliveryOption = (cartItem) => deliveryOptions.find((option) => option.id === cartItem.deliveryOptionId) || deliveryOptions[0];

function updateHeader() {
  const quantity = getCartQuantity();
  document.querySelector('.item-quantity').innerHTML = `Checkout (<a class="return-to-home-link" href="amazon.html">${quantity} ${quantity === 1 ? 'item' : 'items'}</a>)`;
}

function getSummary() {
  const itemTotalCents = cart.reduce((total, cartItem) => total + getProduct(cartItem.productId).priceCents * cartItem.quantity, 0);
  const shippingCents = cart.reduce((total, cartItem) => total + getDeliveryOption(cartItem).priceCents, 0);
  const subtotalCents = itemTotalCents + shippingCents;
  const taxCents = Math.round(subtotalCents * 0.1);
  return { itemTotalCents, shippingCents, subtotalCents, taxCents, totalCents: subtotalCents + taxCents };
}

function renderPaymentSummary() {
  const summary = getSummary();
  const paymentSummary = document.querySelector('.payment-summary');
  paymentSummary.innerHTML = `
    <div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row"><div>Items (${getCartQuantity()}):</div><div class="payment-summary-money">${formatMoney(summary.itemTotalCents)}</div></div>
    <div class="payment-summary-row"><div>Shipping &amp; handling:</div><div class="payment-summary-money">${formatMoney(summary.shippingCents)}</div></div>
    <div class="payment-summary-row subtotal-row"><div>Total before tax:</div><div class="payment-summary-money">${formatMoney(summary.subtotalCents)}</div></div>
    <div class="payment-summary-row"><div>Estimated tax (10%):</div><div class="payment-summary-money">${formatMoney(summary.taxCents)}</div></div>
    <div class="payment-summary-row total-row"><div>Order total:</div><div class="payment-summary-money">${formatMoney(summary.totalCents)}</div></div>
    <button class="place-order-button button-primary" ${cart.length ? '' : 'disabled'}>Place your order</button>
  `;

  const placeOrderButton = document.querySelector('.place-order-button');
  if (cart.length) placeOrderButton.addEventListener('click', placeOrder);
}

function renderCheckout() {
  updateHeader();
  const orderSummary = document.querySelector('.order-summary');

  if (!cart.length) {
    orderSummary.innerHTML = '<div class="empty-message">Your cart is empty. <a class="link-primary" href="amazon.html">Continue shopping</a></div>';
    renderPaymentSummary();
    return;
  }

  orderSummary.innerHTML = cart.map((cartItem) => {
    const product = getProduct(cartItem.productId);
    const selectedOption = getDeliveryOption(cartItem);
    return `
      <div class="cart-item-container">
        <div class="delivery-date">Delivery date: ${formatDate(selectedOption.days)}</div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}" alt="${product.name}">
          <div class="cart-item-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${formatMoney(product.priceCents)}</div>
            <label class="product-quantity">Quantity:
              <select class="js-quantity-select" data-product-id="${product.id}">
                ${Array.from({ length: 10 }, (_, index) => `<option value="${index + 1}" ${cartItem.quantity === index + 1 ? 'selected' : ''}>${index + 1}</option>`).join('')}
              </select>
            </label>
            <button class="delete-quantity-link link-primary js-delete-link" data-product-id="${product.id}">Delete</button>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptions.map((option) => `
              <label class="delivery-option">
                <input type="radio" class="delivery-option-input js-delivery-option" name="delivery-option-${product.id}" value="${option.id}" data-product-id="${product.id}" ${option.id === selectedOption.id ? 'checked' : ''}>
                <span><span class="delivery-option-date">${formatDate(option.days)}</span><span class="delivery-option-price">${option.label}</span></span>
              </label>`).join('')}
          </div>
        </div>
      </div>`;
  }).join('');

  document.querySelectorAll('.js-delete-link').forEach((button) => button.addEventListener('click', () => {
    removeFromCart(button.dataset.productId);
    renderCheckout();
  }));
  document.querySelectorAll('.js-quantity-select').forEach((select) => select.addEventListener('change', () => {
    updateQuantity(select.dataset.productId, Number(select.value));
    renderCheckout();
  }));
  document.querySelectorAll('.js-delivery-option').forEach((input) => input.addEventListener('change', () => {
    const cartItem = cart.find((item) => item.productId === input.dataset.productId);
    cartItem.deliveryOptionId = input.value;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCheckout();
  }));

  renderPaymentSummary();
}

function placeOrder() {
  if (!cart.length) return;
  const summary = getSummary();
  const orderId = crypto.randomUUID();
  const order = {
    id: orderId,
    placedAt: new Date().toISOString(),
    totalCents: summary.totalCents,
    products: cart.map((cartItem) => {
      const option = getDeliveryOption(cartItem);
      return {
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        deliveryDate: new Date(Date.now() + option.days * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Preparing'
      };
    })
  };
  createOrder(order);
  clearCart();
  window.location.href = `orders.html?placed=${orderId}`;
}

renderCheckout();
