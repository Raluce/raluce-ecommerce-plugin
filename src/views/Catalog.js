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
        <div>
          <h1>${name}</h1>
          <ul>
            ${products.map(p => `<li>${p.name} (${PriceFormatter.format(p.price.cost)})</li>`).join('')}
          </ul>
        </div>
      `;
    }), "<button onclick='ralucePlugin.goBack()'>Return</button>"].join('');
  }
}

export default Catalog;
