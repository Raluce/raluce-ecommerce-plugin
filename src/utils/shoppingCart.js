import { sha1 } from 'object-hash';

const shoppingCartKey = 'raluce-ecommerce-plugin/shoopingCart';

export function getShoppingCart() {
  let shoopingCart = localStorage.getItem(shoppingCartKey);

  return !shoopingCart ? [] : JSON.parse(shoopingCart);
}

export function addProduct(product) {
  const hash = getProductHash(product);
  const productDto = mapProductToProductOrderDTO(product);

  addProductToStore({ ...productDto, hash });
}

function addProductToStore(productDto) {
  let shoppingCart = getShoppingCart();
  shoppingCart.push(productDto);

  sessionStorage.setItem(shoppingCartKey, JSON.stringify(shoppingCart));
}

export function removeProduct(hash) {
  let shoppingCart = getShoppingCart();
  shoopingCart = shoppingCart.filter(x => x.hash != hash);

  localStorage.setItem(shoppingCartKey, JSON.stringify(shoppingCart));
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
