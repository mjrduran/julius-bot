'use strict';

import debugModule from 'debug';
import rp from 'request-promise';
import Util from '../util';

const debug = debugModule('juliusBot:RestConnector');

const DEFAULT_OPTIONS = {
  timeout: 30000
};

class RestConnector {

  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.options = Object.assign(DEFAULT_OPTIONS, options);

    const reqDefaults = {
      baseUrl: this.baseUrl,
      timeout: this.options.timeout
    };
    debug('Set request defaults=%j', reqDefaults);
    this.requester = rp.defaults(reqDefaults);
  }

  get(path, qs = {}, options = {}) {
    const params = {
      uri: path,
      qs: qs,
      json: true
    };
    Object.assign(params, options);

    const stamp = Util.stamp();
    debug('GET(%s) request=%j', stamp, params);

    return this.requester.get(params)
      .then(body => {
        debug('GET(%s) response=%j', stamp, body);
        return body;
      });
  }

  post(path, data = {}, options ={}) {
    const params = {
      uri: path,
      json: data
    };
    Object.assign(params, options);

    const stamp = Util.stamp();
    debug('POST(%s) request=%j', stamp, params);

    return this.requester.post(params)
      .then(body => {
        debug('POST(%s) response=%j', stamp, body);
        return body;
      });
  }
}

module.exports = RestConnector;
