import Home from './Home';
import SelectPickupFranchise from './SelectPickupFranchise';
import SelectDeliveryAddress from './SelectDeliveryAddress';
import NoDeliveryToZipcode from './NoDeliveryToZipcode';
import Catalog from './Catalog';
import ProductOptions from './ProductOptions';

export function createViews(context) {
  return {
    home: new Home(context),
    selectPickupFranchise: new SelectPickupFranchise(context),
    selectDeliveryAddress: new SelectDeliveryAddress(context),
    noDeliveryToZipcode: new NoDeliveryToZipcode(context),
    catalog: new Catalog(context),
    productOptions: new ProductOptions(context),
  }
}
