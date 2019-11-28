import Raluce from '@raluce/raluce';

import * as shoppingCart from './utils/shoppingCart';
import { OrderType, setOrderSession, getOrderSession, clear } from './utils/storage';
import { createViews } from './views';

const rootDiv = document.getElementById('raluce-ecommerce-plugin-root');

class RalucePlugin {
  constructor(brandId) {
    if (!brandId) throw new Error('Missing brandId');

    this.raluce = new Raluce();
    this.contentDiv = null;
    this.shoppingCartDialog = null;

    this.headerDiv = null;
    this.bodyDiv = null;

    this.brandId = brandId;
    this.brand = null;
    this.franchise = null;
    this.address = null;
    this.product = null;

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
        <div class="shopping-cart-dialog" id="shopping-cart-dialog" style="background-color: ${color}; visibility: hidden;"></div>
        <div id="raluce-ecommerce-plugin-header">
          <div class="raluce-ecommerce-plugin-picture-box" style="background-image: url('${banner}');"></div>
          <div class="raluce-ecommerce-plugin-color-box" style="background-color: ${color};"></div>
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
    this.updateShoppingCartDialog();
  }

  updateShoppingCartDialog() {
    const cart = shoppingCart.getShoppingCart();
    const shoppingCartSize = cart.length;

    if (shoppingCartSize > 0) {
      this.shoppingCartDialog.innerText = shoppingCartSize.toString();
      this.shoppingCartDialog.style.visibility = 'visible';
    }

    // Calculate price of shopping cart on every update
    if (this.franchise) {
      shoppingCart.getPrice(this.franchise.id)
      .then(price => console.log(price))
      .catch(console.error);
    }

    // Todo: Update list of products in shopping cart dialog
  }

  setView(view) {
    const self = this;
    view.render().then(html => {
      if (view.name === 'home') {
        clear(); // Resets session
      } else {
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

    this.setView(this.views.productOptions);
  }

  addToShoppingCart(quantity = 1) {
    this.goBack();

    shoppingCart.addProduct(this.product, quantity);
    this.updateShoppingCartDialog();
  }
}

export default RalucePlugin;
