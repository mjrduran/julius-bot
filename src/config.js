'use strict';

var convict = require('convict');

var conf = convict({
    env: {
        doc: 'The application environment',
        format: ['production', "development"],
        default: "development",
        env: "NODE_ENV"
    },
    lomadee: {
        url: {
            doc: 'Lomadee API Url',
            format: String,
            default: 'http://sandbox.buscape.com.br'
        },
        token: {
            doc: 'Lomadee API token',
            format: String,
            default: 'xxxxxxxxx'
        },
        sourceId: {
            doc: 'Lomadee source id',
            format: String,
            default: 'xxxxxxxxx'
        }
    },
    botland: {
        citizenId: {
            doc: 'Botland citizen id',
            format: String,
            default: ''
        },
        userToken: {
            doc: 'Botland user token',
            format: String,
            default: ''
        },
        host: {
          doc: 'Botland API host',
          format: String,
          default: 'api.botland.io'
        },
        secure: {
          doc: 'Use secure protocol for Botland API',
          format: Boolean,
          default: true
        }
    }
});

var env = conf.get('env');
conf.loadFile('./config/' + env + '.json');

conf.validate({
    strict: true
});

module.exports = conf;
