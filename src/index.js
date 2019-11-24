import RalucePlugin from './RalucePlugin';

global.RaluceEcommercePluginInit = brandId => {
  global.ralucePlugin = new RalucePlugin(brandId);
  ralucePlugin.init();
};
