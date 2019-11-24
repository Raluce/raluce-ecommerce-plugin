class SelectPickupFranchise {
  constructor(context) {
    this.name = 'selectPickupFranchise',
    this.context = context;
  }

  async render() {
    const { franchises } = this.context.brand;

    return [...franchises.map(franchise => {
      const { address } = franchise;

      return `<button onclick="ralucePlugin.goToCatalog('${franchise.id}')">${address.line1}, ${address.city}, ${address.state} ${address.zipcode}</button>`;
    }), '<button onclick="ralucePlugin.goBack()">Return</button>'].join('');
  }
}

export default SelectPickupFranchise;
