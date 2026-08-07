import { addToCart, getCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';

const productsGrid = document.querySelector('.products-grid');
const searchBar = document.querySelector('.search-bar');
const initialSearch = new URLSearchParams(window.location.search).get('search') || '';

function updateCartQuantity() {
  document.querySelector('.cart-quantity').textContent = getCartQuantity();
}

function renderProducts(searchTerm = '') {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const searchableText = [product.name, ...product.keywords].join(' ').toLowerCase();
    return searchableText.includes(normalizedSearch);
  });

  productsGrid.innerHTML = visibleProducts.length ? visibleProducts.map((product) => `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image" src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-name limit-text-to-2-lines">${product.name}</div>
      <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${product.rating.stars * 10}.png" alt="${product.rating.stars} out of 5 stars">
        <div class="product-rating-count link-primary">${product.rating.count}</div>
      </div>
      <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
      <div class="product-quantity-container">
        <label class="visually-hidden" for="quantity-${product.id}">Quantity for ${product.name}</label>
        <select id="quantity-${product.id}" class="js-quantity-selector">
          ${Array.from({ length: 10 }, (_, index) => `<option value="${index + 1}">${index + 1}</option>`).join('')}
        </select>
      </div>
      <div class="product-spacer"></div>
      <div class="added-to-cart"><img src="images/icons/checkmark.png" alt="">Added</div>
      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `).join('') : '<p class="empty-message">No products matched your search.</p>';

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const quantity = Number(button.parentElement.querySelector('.js-quantity-selector').value);
      addToCart(button.dataset.productId, quantity);
      updateCartQuantity();

      const confirmation = button.parentElement.querySelector('.added-to-cart');
      confirmation.style.opacity = '1';
      window.setTimeout(() => { confirmation.style.opacity = '0'; }, 1500);
    });
  });
}

function searchProducts() {
  renderProducts(searchBar.value);
}

document.querySelector('.search-button').addEventListener('click', searchProducts);
searchBar.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') searchProducts();
});

searchBar.value = initialSearch;
updateCartQuantity();
renderProducts(initialSearch);
