import Raluce from '@raluce/raluce';

class RalucePlugin {
  constructor(brandId) {
    if (!brandId) throw new Error('Missing brandId');

    this.raluce = new Raluce();
    this.brandId = brandId;
  }

  async init() {
    const { raluce, brandId } = this;

    this.catalog = await raluce.getBrandById(brandId);
  }
}

export default RalucePlugin;
