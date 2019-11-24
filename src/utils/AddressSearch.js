import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { throttle, debounce } from 'throttle-debounce';

const geocodingClient = mbxGeocoding({
  accessToken: 'pk.eyJ1IjoiY2FtaWxvODYiLCJhIjoiY2puMHdueWUyMDB3MjNtcjQzdzdvdHZndCJ9.kfbDbGDHOcdcEA3vimZaAw',
});

let results = [];

function handleResult(result) {
  results = result.body.features;
}

function search(address) {
  if (address.length === 0 || !address.trim()) {
    clear();
  }

  geocodingClient
    .forwardGeocode({
      query: address,
      countries: ['us'],
      types: ['address'],
      autocomplete: true,
    })
    .send()
    .then(handleResult)
    .catch(clear);
}

export function getResults() {
  return results;
}

export function clear() {
  results = [];
}

export const throttledAutocomplete = throttle(500, search);
export const debounceAutocomplete = debounce(500, search);
