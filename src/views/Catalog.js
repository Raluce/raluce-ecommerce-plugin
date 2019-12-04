const PriceFormatter = new Intl.NumberFormat({ style: 'currency', currency: 'USD' });

function formatPhoneNumber(phoneNumberString) {
  if (phoneNumberString === undefined) return;
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }
  return null
}

class Catalog {
  constructor(context) {
    this.name = 'catalog';
    this.context = context;
  }

  async render() {
    const { franchise, brand } = this.context;
    const { catalog } = franchise;

    const header = `
      <div class="raluce-ecommerce-plugin-product-card raluce-ecommerce-plugin-max-size-card marginTop15">
        <button class="raluce-ecommerce-plugin-goBack-button" onclick='ralucePlugin.goBack()'></button>
        <center>
          <img class="raluce-ecommerce-catalog-logo" src="${brand.logo}" />
          <div class="raluce-ecommerce-product-options-info">
            <p class="raluce-ecommerce-product-options-product-info-name">${brand.name}</p>
            <br/>
            <p class="raluce-ecommerce-product-options-product-info-description">${franchise.address.line1}. ${franchise.address.city}, ${franchise.address.state}. ${franchise.address.zipcode}</p>
            <br/>
            <p class="raluce-ecommerce-product-options-product-info-description">Phone: ${formatPhoneNumber(franchise.phone)}</p>
          </div>
        </center>
      </div>

    `

    const body = catalog.categories.map(category => {

      const { name, products } = category;
      return `
        <div class="raluce-ecommerce-category-box">
          <h3 class="raluce-ecommerce-category-name">${name}</h3>
          <div class="raluce-ecommerce-category-products-box">
            ${products.map(p => `
              <div class="raluce-ecommerce-product-box" onclick='ralucePlugin.goToProductOptions(${JSON.stringify(p)})'>
                <div class="raluce-ecommerce-product-image" style="background-image:url('${p.image || brand.logo}');"></div>
                <div class="raluce-ecommerce-text-box">
                  <p class="raluce-ecommerce-product-cost">$${PriceFormatter.format(p.price.cost)}</p>
                  <p class="raluce-ecommerce-product-name">${p.name}</p>
                  <p class="raluce-ecommerce-product-description">${p.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    return {header, body: body.join('')}
  }
}

export default Catalog;
