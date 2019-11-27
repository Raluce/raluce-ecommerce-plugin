import { sha1 } from 'object-hash';

const shoppingCartKey = 'raluce-ecommerce-plugin/shoopingCart';

export function getShoppingCart() {
  let shoopingCart = sessionStorage.getItem(shoppingCartKey);

  return !shoopingCart ? [] : JSON.parse(shoopingCart);
}

export function addProduct(product, quantity = 1) {
  if (!product || quantity < 1) return;

  const hash = getProductHash(product);
  addProductToStore({ ...product, hash, quantity });
}

function addProductToStore(product) {
  let shoppingCart = getShoppingCart();

  const productIndex = shoppingCart.findIndex(x => x.hash === product.hash);

  if (productIndex === -1) {
    shoppingCart.push(product);
  } else {
    shoppingCart[productIndex].quantity += product.quantity;
  }

  sessionStorage.setItem(shoppingCartKey, JSON.stringify(shoppingCart));
}

export function removeProduct(hash) {
  let shoppingCart = getShoppingCart();
  shoopingCart = shoppingCart.filter(x => x.hash != hash);

  sessionStorage.setItem(shoppingCartKey, JSON.stringify(shoppingCart));
}

function sortById(a, b) {
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;

  return 0;
}

function mapProductToProductOrderDTO({ id, options }) {
  return {
    id,
    options: options.map(option => ({
      id: option.id,
      choices: option.choices.map(choice => ({ id: choice.id })).sort(sortById),
    })).sort(sortById),
  };
}

function getProductHash(product) {
  return sha1(mapProductToProductOrderDTO(product));
}
