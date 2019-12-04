import { sha1 } from 'object-hash';
import axios from 'axios';

const shoppingCartKey = 'raluce-ecommerce-plugin/shoopingCart';

export function getShoppingCart() {
  let shoopingCart = sessionStorage.getItem(shoppingCartKey);

  return !shoopingCart ? [] : JSON.parse(shoopingCart);
}

export async function getPrice(franchiseId, orderType = 'pickup') {
  const shoppingCart = getShoppingCart();
  const products = shoppingCart.map(mapProductToProductOrderDTO);

  try {
    const { data } = await axios.post(`https://api.raluce.com/v1/franchises/${franchiseId}/orders/quote`, { products, orderType });

    return data;
  } catch (e) {
    return null;
  }
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
  shoppingCart = shoppingCart.filter(x => x.hash != hash);

  sessionStorage.setItem(shoppingCartKey, JSON.stringify(shoppingCart));
}

export function isProductValid(product, selectedOptions) {
  let isValid = true;

  for (var option of product.options) {
    if (!isOptionValid(option, selectedOptions[option.id])) return false;
  }

  return isValid;
}

export function isOptionValid(option, selectedOption) {
  if (!selectedOption) return false;

  const size = selectedOption.size;

  return size >= option.min && size <= option.max;
}

export function mapSelectedOptionsToProductOptionsDto(selectedOptions) {
  const optionIds = Object.keys(selectedOptions);
  const options = [];

  for (var optionId of optionIds) {
    options.push({
      id: optionId,
      choices: Array.from(selectedOptions[optionId]).map(id => ({ id }))
    });
  }

  return options;
}

function sortById(a, b) {
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;

  return 0;
}

function mapProductToProductOrderDTO({ id, options, quantity = 1 }) {
  return {
    id,
    quantity,
    options: options.map(option => ({
      id: option.id,
      choices: option.choices.map(choice => ({ id: choice.id })).sort(sortById),
    })).sort(sortById),
  };
}

function getProductHash(product) {
  return sha1(mapProductToProductOrderDTO(product));
}
