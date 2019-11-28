class ProductOptions {
  constructor(context) {
    this.name = 'productOptions';
    this.context = context;
  }

  async render() {
    const { product } = this.context;

    const header = `
      <button onclick="ralucePlugin.goBack()">Return</button>
      <div class="raluce-ecommerce-plugin-product-card raluce-ecommerce-plugin-max-size-card marginTop15">

        <div class="raluce-ecommerce-product-options-image" style="background-image:url('${product.image}');"></div>
        <div class="raluce-ecommerce-product-options-info">
          <h4 class="raluce-ecommerce-product-options-product-info-name">${product.name}</h4>
          <p class="raluce-ecommerce-product-options-product-price">$${product.price.cost}</p>
          <p class="raluce-ecommerce-product-options-product-info-description">${product.description}</p>
        </div>
      </div>
    `;
    const body =  `
      <div>
        ${
          product.options.map(option => `
            <div class="raluce-ecommerce-plugin-product-card marginTop15">
              <div class="padding15">
                <h3>${option.name}<h3>
                <hr/>
                ${option.choices.map(choice => `
                  <button class="raluce-ecommerce-product-options-choice-button">${choice.name}</button>
                `).join('')}
              </div>
            </div>
          `).join('')
        }
        <div class="raluce-ecommerce-plugin-product-card marginTop15">
              <div class="padding15">
                <center>
                  <button onclick="ralucePlugin.addToShoppingCart(3)" class="raluce-ecommerce-product-options-choice-button raluce-ecommerce-active-button">Add to shopping cart</button>
                </center>
              </div>
            </div>
      </div>
    `;

    return {header, body}
  }
}

export default ProductOptions;
