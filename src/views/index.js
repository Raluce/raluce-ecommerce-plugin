import Home from './Home';
import SelectPickupFranchise from './SelectPickupFranchise';
import SelectDeliveryAddress from './SelectDeliveryAddress';
import Catalog from './Catalog';

export function createViews(context) {
  return {
    home: new Home(context),
    selectPickupFranchise: new SelectPickupFranchise(context),
    selectDeliveryAddress: new SelectDeliveryAddress(context),
    catalog: new Catalog(context),
  }
}
