'use strict'


const toPriceFormat = (price) => {
  if(typeof price === 'string' && price.match(/^\d+(,\d{1,2})?(\.\d{1,2})?/)) {
    price = price.match(/^\d+(,\d{1,2})?(\.\d{1,2})?/)[0];
    price = price.replace(',', '.');
  }
  return ~~Number(price)>0 ? +parseFloat(price).toFixed(2) : undefined;
}

/**
 * A set of rules we want to declare under `metascraper-price` namespace.
 *
**/
module.exports = () => {
  const rules = {
    price: [
      ({ htmlDom: $, url }) => toPriceFormat($('[data-qa-id="adview_price"]').text()),//leboncoin
      ({ htmlDom: $, url }) => toPriceFormat($('.buyBoxBlock .price').text()),//rakuten
      ({ htmlDom: $, url }) => toPriceFormat($('.a-price .a-offscreen').text())//amazonfr
    ]
  }
  return rules
}