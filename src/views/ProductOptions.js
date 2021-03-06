class ProductOptions {
  constructor(context) {
    this.name = 'productOptions';
    this.context = context;
  }

  isChoiceSelected(optionId, choiceId) {
    const option = this.context.selectedOptions[optionId];
    if (!option) return false;

    return option.has(choiceId);
  }

  async render() {
    const { product, isProductOptionsValid, brand } = this.context;
    const self = this;

    const header = `
      <div class="raluce-ecommerce-plugin-product-card raluce-ecommerce-plugin-max-size-card marginTop15">
        <button class="raluce-ecommerce-plugin-goBack-button" onclick="ralucePlugin.goBack()"></button>
        <div class="raluce-ecommerce-product-options-image" style="background-image:url('${product.image || brand.logo}');"></div>
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
                <h3 class="raluce-ecommerce-option-name">${option.name}</h3>
                <p class="raluce-ecommerce-option-instructions">${option.isRequired ? '(required)' : ''} Please select ${option.max} choices</p>
                <hr/>
                ${option.choices.map(choice => {
                  const optionId = option.id;
                  const choiceId = choice.id;
                  let activeClass = self.isChoiceSelected(optionId, choiceId) ? 'active' : '';

                  return `<button class="raluce-ecommerce-product-options-choice-button ${activeClass}" onclick='ralucePlugin.handleSelectProductChoice("${optionId}", "${choiceId}", ${JSON.stringify(option)})'>${choice.name}</button>`;
                }).join('')}
              </div>
            </div>
          `).join('')
        }
        <div class="raluce-ecommerce-plugin-product-card marginTop15">
              <div class="padding15">
                <center>
                  <button class="raluce-ecommerce-product-options-choice-button ${isProductOptionsValid ? 'raluce-ecommerce-active-button' : ''}" ${!isProductOptionsValid ? 'disabled' : ''} onclick="ralucePlugin.addToShoppingCart()">Add to shopping cart</button>
                </center>
              </div>
            </div>
      </div>
    `;

    return {header, body}
  }
}

export default ProductOptions;
