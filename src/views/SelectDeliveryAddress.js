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
      <div>
        <p>What's your address?</p>
        <input type="text" id="address-input" />
        <div id="address-autocomplete-list"></div>
      </div>
      <button onclick="ralucePlugin.goBack()">Return</button>
    `;
  }
}

export default SelectPickupFranchise;
