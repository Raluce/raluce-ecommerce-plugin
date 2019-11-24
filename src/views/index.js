import Home from './Home';
import SelectPickupFranchise from './SelectPickupFranchise';
import Catalog from './Catalog';

export function createViews(context) {
  return {
    home: new Home(context),
    selectPickupFranchise: new SelectPickupFranchise(context),
    catalog: new Catalog(context),
  }
}
