import * as addressSearch from '../utils/addressSearch';
import { featureToAddress } from '../utils/parsers';

function beginAutocorrect() {
  const input = document.getElementById('address-input');

  input.addEventListener('input', e => {
    const addressAutocompleteList = document.getElementById('address-autocomplete-list');
    const address = e.target.value;

    if (address.length <= 4) {
      addressSearch.throttledAutocomplete(address);
    } else {
      addressSearch.debounceAutocomplete(address);
    }

    addressAutocompleteList.innerHTML = addressSearch.getResults()
      .map(result => {
        const parsedAddress = JSON.stringify(featureToAddress(result));

        return `<button onclick='ralucePlugin.goToSelectFranchiseForDelivery(${parsedAddress})'>${result.place_name.replace(', United States', ', US')}</button>`;
      })
      .join('');
  });
}

class SelectPickupFranchise {
  constructor(context) {
    this.name = 'selectDeliveryAddress',
    this.context = context;
  }

  async render() {
    setTimeout(beginAutocorrect, 500);

    return `
      <div class="raluce-ecommerce-plugin-container">
          <h1 class="raluce-ecommerce-plugin-order-now-header">Order Now</h1>
          <div class="raluce-ecommerce-plugin-card">
            <button class="raluce-ecommerce-plugin-goBack-button" onclick="ralucePlugin.goBack()"></button>
            <div>
              <p class="raluce-ecommerce-plugin-what-is-your-address-question">What's your address?</p>
              <input type="text" id="address-input" autocomplete="off" />
              <div id="address-autocomplete-list"></div>
            </div>
          </div>
      </div>
    `;
  }
}

export default SelectPickupFranchise;
