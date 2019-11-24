export const featureToAddress = feature => {
  const city = feature.context.find(x => x.id.split('.')[0] === 'place').text;
  const zipcode = feature.context.find(x => x.id.split('.')[0] === 'postcode')
    .text;
  const state = feature.context
    .find(x => x.id.split('.')[0] === 'region')
    .short_code.split('-')[1];

  return {
    line1: feature.address ?  `${feature.address} ${feature.text}` : feature.text,
    line2: '',
    city: city || '',
    state: state || '',
    zipcode: zipcode || '',
    country: 'US',
  };
};
