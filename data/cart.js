export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartQuantity() {
  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
}

export function addToCart(productId, quantity = 1) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveToCart();
}

export function updateQuantity(productId, quantity) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (!matchingItem) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  matchingItem.quantity = quantity;
  saveToCart();
}

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToCart();
}

export function clearCart() {
  cart = [];
  saveToCart();
}
