class SelectPickupFranchise {
  constructor(context) {
    this.name = 'selectPickupFranchise',
    this.context = context;
  }

  mapFranchiseToButton(franchise, color) {
    return `
      <button class="raluce-ecommerce-button" style="background-color: ${color || '#5252dd'};" onclick="ralucePlugin.goToCatalog('${franchise.id}')">
        ${franchise.address.line1}, ${franchise.address.city}, ${franchise.address.state} ${franchise.address.zipcode}
      </button>
    `
  }

  async render() {
    const { franchises, color } = this.context.brand;

    const franchiseButtonlist = franchises.map(franchise => this.mapFranchiseToButton(franchise, color)).join('');

    return `
      <div class="raluce-ecommerce-plugin-container">
          <h1 class="raluce-ecommerce-plugin-order-now-header">Order Now</h1>
          <div class="raluce-ecommerce-plugin-card">
            <button class="raluce-ecommerce-plugin-goBack-button" onclick="ralucePlugin.goBack()">Return</button>
            <p class="raluce-ecommerce-plugin-select-franchise-question">Select franchise</p>
            <div class="raluce-ecommerce-plugin-franchise-list">
              ${franchiseButtonlist}
            </div>
          </div>
      </div>
    `
  }
}

export default SelectPickupFranchise;
