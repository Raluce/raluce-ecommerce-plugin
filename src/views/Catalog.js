const PriceFormatter = new Intl.NumberFormat({ style: 'currency', currency: 'USD' });

class Catalog {
  constructor(context) {
    this.name = 'catalog';
    this.context = context;
  }

  async render() {
    const { catalog } = this.context.franchise;

    return [...catalog.categories.map(category => {
      const { name, products } = category;

      return `
        <div class="raluce-ecommerce-category-box">
          <h3 class="raluce-ecommerce-category-name">${name}</h3>
          <div class="raluce-ecommerce-category-products-box">
            ${products.map(p => `
              <div class="raluce-ecommerce-product-box" onclick='ralucePlugin.goToProductOptions(${JSON.stringify(p)})'>
                <div class="raluce-ecommerce-product-image" style="background-image:url('${p.image}');"></div>
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
    }), "<button onclick='ralucePlugin.goBack()'>Return</button>"].join('');
  }
}

export default Catalog;
