class Home {
  constructor(context) {
    this.name = 'home';
    this.context = context;
  }

  async render() {
    const deliveryViewName = this.context.views.selectDeliveryAddress.name;
    const pickupViewName = this.context.views.selectPickupFranchise.name;

    return `
      <button onclick="ralucePlugin.navigateTo('${deliveryViewName}')">Delivery</button>
      <button onclick="ralucePlugin.navigateTo('${pickupViewName}')">Pickup</button>
    `;
  }
}

export default Home;
