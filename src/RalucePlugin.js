import Raluce from '@raluce/raluce';

import { OrderType, setOrderSession, getOrderSession, clear } from './utils/storage';

import { createViews } from './views';

const rootDiv = document.getElementById('raluce-ecommerce-plugin-root');

class RalucePlugin {
  constructor(brandId) {
    if (!brandId) throw new Error('Missing brandId');

    this.raluce = new Raluce();

    this.brandId = brandId;
    this.brand = null;
    this.franchise = null;

    this.views = createViews(this);
    this.viewsHistory = [];
  }

  async init() {
    const { raluce, brandId } = this;

    this.brand = await raluce.getBrandById(brandId);
    if (!this.brand) return;

    const orderSession = getOrderSession();

    if (!orderSession) {
      this.setView(this.views.home);
    } else if (orderSession.orderType === OrderType.pickup) {
      this.goToCatalog(orderSession.franchiseId, orderSession.orderType);
    } else if (orderSession.orderType === OrderType.delivery) {
      // Todo
    }
  }

  setView(view) {
    const self = this;
    view.render().then(html => {
      if (view.name === 'home') {
        clear(); // Resets session
      } else {
        self.viewsHistory.push(view.name);
      }

      rootDiv.innerHTML = html;
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

  async goToCatalog(franchiseId, orderType) {
    this.franchise = await this.raluce.getFranchiseById(franchiseId);
    if (!this.franchise) return;

    setOrderSession(franchiseId, orderType || OrderType.pickup);

    this.setView(this.views.catalog);
  }
}

export default RalucePlugin;
