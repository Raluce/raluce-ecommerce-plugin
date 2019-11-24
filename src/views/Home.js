class Home {
  constructor(context) {
    this.name = 'home';
    this.context = context;
  }

  async render() {
    const pickupViewName = this.context.views.selectPickupFranchise.name;

    return `
      <button>Delivery</button>
      <button onclick="ralucePlugin.navigateTo('${pickupViewName}')">Pickup</button>
    `;
  }
}

export default Home;
