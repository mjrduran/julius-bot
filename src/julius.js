'use strict';

import LomadeeAPI from './rest/lomadee-api';
import MessageHandler from './handler/message-handler';
import botland from 'botland-sdk';
let Citizen = botland.Citizen;

class JuliusBot {
  constructor(botlandCitizenId,
    botlandUserToken,
    botlandOptions,
    lomadeeToken,
    lomadeeUrl,
    lomadeeSourceId){

    this.citizen = new Citizen(botlandCitizenId, botlandUserToken, botlandOptions);
    this.lomadee = new LomadeeAPI(lomadeeToken, lomadeeUrl);
    this.messageHandler = new MessageHandler(this.citizen, this.lomadee, lomadeeSourceId);
  }

  start(){
      this.citizen.start();
  }
}

module.exports = JuliusBot;
