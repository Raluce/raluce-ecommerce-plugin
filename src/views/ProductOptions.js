class ProductOptions {
  constructor(context) {
    this.name = 'productOptions';
    this.context = context;
  }

  async render() {
    const { product } = this.context;

    const productOptions = product.options.map(option => `<button>${option.name}</button>`).join('');

    return `
      <div>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        ${productOptions}
        <button onclick="ralucePlugin.addToShoppingCart(3)">Add to shopping cart</button>
        <button onclick="ralucePlugin.goBack()">Return</button>
      </div>
    `;
  }
}

export default ProductOptions;
