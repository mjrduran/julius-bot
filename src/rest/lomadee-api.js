'use strict';

import RestConnector from './rest';

class LomadeeAPI {

  constructor(token, host, options = {}) {
    this.rp = new RestConnector(host, options);
    this.token = token;
  }

  _qs(values, ...names) {
    const queryString = {};
    if (values) {
      names.forEach(name => {
        if (typeof(values[name]) !== 'undefined') {
          queryString[name] = values[name];
        }
      });
    }
    return queryString;
  }

  getProductList(options){
    return this.rp.get(`/service/findProductList/buscape/${this.token}/br`,
      this._qs(options, 'sourceId', 'format', 'sort', 'keyword', 'page', 'results'))
      .then(body => body);
  }

  getOfferList(options){
    return this.rp.get(`/service/findOfferList/buscape/${this.token}/br`,
      this._qs(options, 'sourceId', 'format', 'sort', 'keyword', 'page', 'results', 'productId'))
      .then(body => body);
  }


}

module.exports = LomadeeAPI;
