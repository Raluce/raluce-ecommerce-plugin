import Raluce from '@raluce/raluce';

import { OrderType, setOrderSession, getOrderSession, clear } from './utils/storage';
import { createViews } from './views';

const rootDiv = document.getElementById('raluce-ecommerce-plugin-root');

class RalucePlugin {
  constructor(brandId) {
    if (!brandId) throw new Error('Missing brandId');

    this.raluce = new Raluce();
    this.contentDiv = null;

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
        <div class="raluce-ecommerce-plugin-picture-box" style="background-image: url('${banner}');"></div>
        <div class="raluce-ecommerce-plugin-color-box" style="background-color: ${color};"></div>
      `;
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'raluce-ecommerce-plugin-content';

    this.contentDiv = contentDiv;
    rootDiv.appendChild(contentDiv);
  }

  setView(view) {
    const self = this;
    view.render().then(html => {
      if (view.name === 'home') {
        clear(); // Resets session
      } else {
        self.viewsHistory.push(view.name);
      }

      self.contentDiv.innerHTML = html;
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
}

export default RalucePlugin;
