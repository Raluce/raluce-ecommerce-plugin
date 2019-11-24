import Raluce from '@raluce/raluce';

import { OrderType, setOrderSession, getOrderSession, clear } from './utils/storage';
import { featureToAddress } from './utils/parsers';
import { createViews } from './views';

const rootDiv = document.getElementById('raluce-ecommerce-plugin-root');

class RalucePlugin {
  constructor(brandId) {
    if (!brandId) throw new Error('Missing brandId');

    this.raluce = new Raluce();

    this.brandId = brandId;
    this.brand = null;
    this.franchise = null;
    this.address = null;

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
      this.goToCatalog(orderSession.franchiseId);
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

    this.franchise = await this.raluce.getFranchiseById(franchisesNearby[0].id);
    if (!this.franchise) return;

    setOrderSession(this.franchise.id, OrderType.delivery, address);

    this.setView(this.views.catalog);
  }


}

export default RalucePlugin;
