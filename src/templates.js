const PriceFormatter = new Intl.NumberFormat({ style: 'currency', currency: 'USD' });

export const TemplateTypes = {
  selectPickupFranchise: 'selectPickupFranchise',
  selectDeliveryAddress: 'selectDeliveryAddress',
  catalog: 'catalog',
}

export const orderTypeChooser = () => `
  <button>Delivery</button>
  <button onclick="ralucePlugin.renderSelectPickupFranchiseTemplate()">Pickup</button>
`;

export const selectPickupFranchise = franchises => [...franchises.map(franchise => {
  const { address } = franchise;

  return `<button onclick="ralucePlugin.handleSelectFranchise('${franchise.id}')">${address.line1}, ${address.city}, ${address.state} ${address.zipcode}</button>`;
}), '<button onclick="ralucePlugin.goBack()">Return</button>'].join('');


export const catalog = catalog => [...catalog.categories.map(category => {
  const { name, products } = category;

  return `
    <div>
      <h1>${name}</h1>
      <ul>
        ${products.map(p => `<li>${p.name} (${PriceFormatter.format(p.price.cost)})</li>`).join('')}
      </ul>
    </div>
  `;
}), '<button onclick="ralucePlugin.goBack()">Return</button>'].join('');
