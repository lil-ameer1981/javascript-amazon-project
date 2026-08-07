export let orders = JSON.parse(localStorage.getItem('orders')) || [];

function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function createOrder(order) {
  orders.unshift(order);
  saveOrders();
}

export function getOrder(orderId) {
  return orders.find((order) => order.id === orderId);
}
