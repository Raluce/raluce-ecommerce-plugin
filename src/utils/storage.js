const orderSessionKey = 'raluce-ecommerce-plugin/orderType';

export const OrderType = {
  delivery: 'delivery',
  pickup: 'pickup'
};

export function setOrderSession(franchiseId, orderType) {
  sessionStorage.setItem(orderSessionKey, JSON.stringify({ franchiseId, orderType }));
}

export function getOrderSession() {
  const orderSession = sessionStorage.getItem(orderSessionKey);

  return orderSession ? JSON.parse(orderSession) : null;
}

export function clear() {
  sessionStorage.clear();
}
