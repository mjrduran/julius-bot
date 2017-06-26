import uuid from 'node-uuid';
import crypto from 'crypto';

const UUID_REGEX = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
const NON_EMPTY_REGEX = /([^\s])/;

class Util {

  static uuid() {
    return uuid.v4();
  }

  static stamp() {
    return Util.randomValueHex(8);
  }

  static randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len / 2))
      .toString('hex')
      .slice(0, len);
  }
}

Util.UUID_REGEX = UUID_REGEX;
Util.NON_EMPTY_REGEX = NON_EMPTY_REGEX;

module.exports = Util;
