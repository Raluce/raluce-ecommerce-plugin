import Raluce from '@raluce/raluce';
import axios from 'axios';

import * as shoppingCart from './utils/shoppingCart';
import { OrderType, setOrderSession, getOrderSession, clear } from './utils/storage';
import { createViews } from './views';

const PriceFormatter = new Intl.NumberFormat({ style: 'currency', currency: 'USD' });
const rootDiv = document.getElementById('raluce-ecommerce-plugin-root');

class RalucePlugin {
  constructor(brandId) {
    if (!brandId) throw new Error('Missing brandId');

    this.raluce = new Raluce();
    this.contentDiv = null;
    this.shoppingCartDialog = null;
    this.shoppingCartModal = null;

    this.headerDiv = null;
    this.bodyDiv = null;
    this.isShoppingCartModalOpen = false;

    this.brandId = brandId;
    this.brand = null;
    this.franchise = null;
    this.address = null;
    this.product = null;
    this.selectedOptions = {};
    this.isProductOptionsValid = false;

    this.views = createViews(this);
    this.viewsHistory = [];
  }

  async init() {
    const { raluce, brandId } = this;

    this.brand = await raluce.getBrandById(brandId);
    if (!this.brand) return;

    const orderSession = getOrderSession();

    this.contentDivConfig();

    if (!orderSession) {
      this.setView(this.views.home);
    } else if (orderSession.orderType === OrderType.pickup) {
      this.goToCatalog(orderSession.franchiseId);
    } else if (orderSession.orderType === OrderType.delivery) {
      // Todo
    }
  }

  contentDivConfig() {
    const { banner, color } = this.brand;

    if (banner && color) {
      rootDiv.innerHTML = `
        <div onclick="ralucePlugin.toggleShopingCart()" class="shopping-cart-dialog" id="shopping-cart-dialog" style="background-color: ${color}; visibility: hidden;display:none;"></div>
        <div id="raluce-ecommerce-plugin-shopping-cart-modal" style="visibility: hidden;display:none;"></div>
        <div id="raluce-ecommerce-plugin-header">
          <div class="raluce-ecommerce-plugin-picture-box" style="background-image: url('${banner}');"></div>
          <div class="raluce-ecommerce-plugin-color-box" style="background-color: ${color || '#5252dd'};"></div>
        </div>
        <div id="raluce-ecommerce-plugin-body"></div>
      `;
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'raluce-ecommerce-plugin-content';

    this.headerDiv = document.getElementById('raluce-ecommerce-plugin-header');
    this.bodyDiv = document.getElementById('raluce-ecommerce-plugin-body');
    this.contentDiv = contentDiv;
    this.headerDiv.appendChild(contentDiv);

    this.shoppingCartDialog = document.getElementById('shopping-cart-dialog');
    this.shoppingCartModal = document.getElementById('raluce-ecommerce-plugin-shopping-cart-modal');
    this.updateShoppingCartDialog();
  }

  updateShoppingCartDialog() {
    const cart = shoppingCart.getShoppingCart();
    const shoppingCartSize = cart.length;

    if (shoppingCartSize > 0) {
      this.shoppingCartDialog.innerText = shoppingCartSize.toString();
      this.shoppingCartDialog.style.visibility = 'visible';
      this.shoppingCartDialog.style.display = 'block';
    }

    // Calculate price of shopping cart on every update
    if (this.franchise) {
      shoppingCart.getPrice(this.franchise.id)
      .then(price => console.log(price))
      .catch(console.error);
    }

    // Todo: Update list of products in shopping cart dialog
  }

  toggleShopingCart() {
    if (this.isShoppingCartModalOpen) {
      this.shoppingCartModal.style.visibility = 'hidden';
      this.shoppingCartModal.style.display = 'none';
      this.isShoppingCartModalOpen = false;
      return;
    }

    const cart = shoppingCart.getShoppingCart();
    this.shoppingCartModal.innerHTML = `
      <div class="raluce-ecommerce-plugin-shopping-cart-header" style="background-color:${this.brand.color || '#5252dd'}">
        <h5>Shopping Cart</h5>
        <div class="raluce-ecommerce-plugin-shopping-cart-dismiss" onclick="ralucePlugin.toggleShopingCart()">

        </div>
      </div>
      <center class="raluce-ecommerce-plugin-shopping-cart-products">
      ${
        cart.map(p => {
          return `
            <div class="raluce-ecommerce-shopping-cart-product-box">
              <p class="raluce-ecommerce-shopping-cart-product-name">${p.quantity}x ${p.name}</p>
              <p class="raluce-ecommerce-shopping-cart-product-price">$${p.price.cost}</p>
              <button class="raluce-ecommerce-shopping-cart-delete-product" onclick="ralucePlugin.removeProduct('${p.hash}')">+</button>
            </div>
          `
        }).join('')
      }
      </center>
      <button class="raluce-ecommerce-plugin-shopping-cart-pay-button" onclick="ralucePlugin.checkout()">Checkout</button>
    `
    this.shoppingCartModal.style.visibility = 'visible';
    this.shoppingCartModal.style.display = 'block';
    this.isShoppingCartModalOpen = true;
  }

  removeProduct(hash) {
    shoppingCart.removeProduct(hash);
    this.shoppingCartDialog.innerText = shoppingCart.getShoppingCart().length.toString();
    this.toggleShopingCart();
  }

  setView(view, refresh = false) {
    const self = this;
    view.render().then(html => {
      if (view.name === 'home') {
        clear(); // Resets session
      } else if (!refresh) {
        self.viewsHistory.push(view.name);
      }

      this.bodyDiv.innerHTML = '';
      if (view.name !== 'catalog' && view.name !== 'productOptions') {
        self.contentDiv.innerHTML = html;
      } else {
        self.contentDiv.innerHTML = html.header;
        self.bodyDiv.innerHTML = html.body;
      }

    }).catch(console.error);
  }

  navigateTo(viewName) {
    const view = this.views[viewName];
    if (!view) return false;

    this.setView(view);

    return true;
  }

  goBack() {
    this.viewsHistory.pop();
    const previousView = this.viewsHistory.pop();

    if (!this.navigateTo(previousView)) {
      this.setView(this.views.home);
    }
  }

  async goToCatalog(franchiseId, address = undefined) {
    this.franchise = await this.raluce.getFranchiseById(franchiseId);
    if (!this.franchise) return;

    setOrderSession(franchiseId, address ? OrderType.delivery : OrderType.pickup, address);

    this.setView(this.views.catalog);
  }

  async goToSelectFranchiseForDelivery(address) {
    this.address = address;

    const franchisesNearby = await this.raluce.getFranchiesDeliveryingToZipcode(this.brandId, address.zipcode);

    if (franchisesNearby.length === 0) {
      this.setView(this.views.noDeliveryToZipcode);
      return;
    }

    this.goToCatalog(franchisesNearby[0].id, address);
  }

  async goToProductOptions(product) {
    this.product = product;
    this.selectedOptions = {};
    this.isProductOptionsValid = shoppingCart.isProductValid(this.product, this.selectedOptions); // some products may be valid to start off

    this.setView(this.views.productOptions);
  }

  addToShoppingCart(quantity = 1) {
    if (!this.isProductOptionsValid) return;

    this.goBack();

    let productDto = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      options: shoppingCart.mapSelectedOptionsToProductOptionsDto(this.selectedOptions),
    };

    shoppingCart.addProduct(productDto, quantity);
    this.updateShoppingCartDialog();
  }

  handleSelectProductChoice(optionId, choiceId, productOption) {
    const option = this.selectedOptions[optionId];
    if (!option)
    {
      this.selectedOptions[optionId] = new Set([choiceId]);
    } else {
      if (option.has(choiceId)) {
        option.delete(choiceId);
      } else if (productOption.max === 1) {
        option.clear();
        option.add(choiceId);
      } else if (productOption.max > option.size) {
        option.add(choiceId);
      }
    }

    this.isProductOptionsValid = shoppingCart.isProductValid(this.product, this.selectedOptions);

    // Refresh view with new data
    this.setView(this.views.productOptions, true);
  }

  checkout() {
    const { orderType } = getOrderSession();
    const products = shoppingCart.getShoppingCart();

    const windowReference = window.open();

    this.raluce.createShoppingCart({
      type: orderType || 'pickup',
      franchiseId: this.franchise.id,
      products,
    })
    .then(({ id }) => {
      windowReference.location = `https://stores.raluce.com/franchises/${this.franchise.id}/order?shoppingCartId=${id}`;
    })
    .catch(console.error);
  }
}

export default RalucePlugin;
