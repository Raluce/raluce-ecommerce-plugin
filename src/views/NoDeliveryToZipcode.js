class NoDeliveryToZipcode {
  constructor(context) {
    this.name = 'noDeliveryToZipcode';
    this.context = context;
  }

  async render() {
    return `
      <h1>Unfortunetly, no locations delivery to your address at this time</h1>
      <button onclick="ralucePlugin.goBack()">Return</button>
    `;
  }
}

export default NoDeliveryToZipcode;
