'use strict';

import config from './config.js'
import JuliusBot from './julius.js'

let botlandOptions = {
    secure: config.get('botland.secure'),
    host: config.get('botland.host')
};

let juliusBot = new JuliusBot(
    config.get('botland.citizenId'),
    config.get('botland.userToken'),
    botlandOptions,
    config.get('lomadee.token'),
    config.get('lomadee.url'),
    config.get('lomadee.sourceId')
);

juliusBot.start();
