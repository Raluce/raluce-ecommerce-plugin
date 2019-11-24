import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { throttle, debounce } from 'throttle-debounce';

const geocodingClient = mbxGeocoding({
  accessToken: 'pk.eyJ1IjoiY2FtaWxvODYiLCJhIjoiY2puMHdueWUyMDB3MjNtcjQzdzdvdHZndCJ9.kfbDbGDHOcdcEA3vimZaAw',
});

class AddressSearch {
  constructor() {
    this.results = [];

    this.throttledAutocomplete = throttle(500, this.search);
    this.debounceAutocomplete = debounce(500, this.search);
  }

  search(address) {
    if (address.length === 0 || !address.trim()) {
      this.onCleanResult();
    }

    geocodingClient
      .forwardGeocode({
        query: address,
        countries: ['us'],
        types: ['address'],
        autocomplete: true,
      })
      .send()
      .then(this.onResult)
      .catch(this.onCleanResult);
  }

  onResult(result) {
    this.results = result.body.features;
  }

  onCleanResult() {
    this.results = [];
  }
}

export default AddressSearch;
