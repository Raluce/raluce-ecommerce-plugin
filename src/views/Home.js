class Home {
  constructor(context) {
    this.name = 'home';
    this.context = context;
  }

  async render() {
    const deliveryViewName = this.context.views.selectDeliveryAddress.name;
    const pickupViewName = this.context.views.selectPickupFranchise.name;
    const brand = this.context.brand;

    return `
      <div class="raluce-ecommerce-plugin-container">
          <h1 class="raluce-ecommerce-plugin-order-now-header">Order Now</h1>
          <div class="raluce-ecommerce-plugin-card">
            <div>
              <p>How should we take your order?</p>
              <button class="raluce-ecommerce-button" style="background-color: ${brand.color};" onclick="ralucePlugin.navigateTo('${deliveryViewName}')">Delivery</button>
              <button class="raluce-ecommerce-button" style="background-color: ${brand.color};" onclick="ralucePlugin.navigateTo('${pickupViewName}')">Pickup</button>
            </div>
          </div>
      </div>
    `;
  }
}

export default Home;
