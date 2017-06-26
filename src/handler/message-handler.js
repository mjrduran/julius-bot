'use strict';

import _ from 'underscore';

const HELP_TEXT = 'Vou te ajudar a encontrar os melhores preços!\n' +
  'Basta você escrever o nome do produto que deseja.\n' +
  'Por exemplo:\n' +
  'iphone 6\n' +
  'playstation\n';

const EXIT_TEXT = 'Você não precisa sair! Fique tranquilo, ' +
  'tenho dois empregos e não tenho tempo de enviar spam :)';

const NOT_FOUND_PRODUCT_TEXT = 'Desculpe, não encontrei esse produto.';

const NOT_FOUND_OFFER_TEXT = 'Desculpe, não encontrei ofertas para esse produto.';

const PRODUCT_POSTBACK_PREFIX = '_prod_';

class MessageHandler {

  constructor(citizen, lomadee, lomadeeSourceId) {
    this.citizen = citizen;
    this.lomadee = lomadee;
    this.lomadeeSourceId = lomadeeSourceId;

    this.lomadeeOptions = {
      sourceId: lomadeeSourceId,
      format: 'json'
    };

    this.citizen.on('error', err => console.log('ops, error: %s', err));
    this.citizen.on('started', () => console.log('bot is connected'));
    this.citizen.on('message', msg => this.handleMessage(msg));
    this.citizen.on('postback', postback => this.handlePostback(postback));
  }

  handleMessage(msg) {
    console.log('received message: ' + JSON.stringify(msg));
    if (msg.text && typeof msg.text === 'string') {
      let userMessage = msg.text.toLowerCase();

      switch (userMessage) {
      case 'ajuda':
      case 'help':
        this.reply(msg, HELP_TEXT);
        break;

      case 'sair':
      case 'parar':
      case 'stop':
        this.reply(msg, EXIT_TEXT);
        break;

      default:
        this.searchProduct(msg, userMessage);
        break;
      }
    }
  }

  searchProduct(msg, keyword) {
    let options = _.clone(this.lomadeeOptions);
    options.keyword = keyword;
    options.results = 10;

    this.lomadee.getProductList(options).then(productList => {

      if (productList && productList.product && productList.product.length > 0) {
        let prodCarousel = this.createCarouselByProducts(productList);
        let reply = msg.createReply(prodCarousel);
        this.citizen.send(reply)
          .then(mid => console.log('replied %s', mid))
          .catch(err => console.log('reply error: %s', err));
      } else {
        this.reply(msg, NOT_FOUND_PRODUCT_TEXT);
      }
    });
  }

  createCarouselByProducts(productList) {
    let result = {
      messageType: 'CAROUSEL',
      attachment: {}
    };
    //console.log('received object:' + JSON.stringify(productList));
    result.attachment.carousel = productList.product.map((prod) => {
      let thumbnailUrl = '';

      if (prod.product.thumbnail && prod.product.thumbnail.formats && prod.product.thumbnail.formats.length > 0) {
        thumbnailUrl = prod.product.thumbnail.formats[prod.product.thumbnail.formats.length - 1].formats.url;
        thumbnailUrl = thumbnailUrl.replace('thumbs.buscape.com.br', 'thumbs.buscape.com.br.rsz.io');
        thumbnailUrl += '?w=400&h=200&bgcolor=white';
      }

      let item = {
        title: prod.product.productname,
        imageUrl: thumbnailUrl,
        actions: [{
          title: 'Ver ofertas',
          postback: PRODUCT_POSTBACK_PREFIX + prod.product.id
        }]
      };
      return item;
    });
    return result;
  }

  handlePostback(postbackMsg) {
    console.log('received postback: ' + JSON.stringify(postbackMsg));

    if (postbackMsg && postbackMsg.attachment && postbackMsg.attachment.postback) {
      let value = postbackMsg.attachment.postback.value;
      let productId = value.substr(PRODUCT_POSTBACK_PREFIX.length, value.length);
      this.searchOffer(postbackMsg, productId);
    }
  }

  searchOffer(msg, productId) {
    console.log('product id: ' + productId);

    let options = _.clone(this.lomadeeOptions);
    options.productId = productId;
    options.results = 10;
    options.sort = 'drate';

    this.lomadee.getOfferList(options).then(offerList => {
      if (offerList && offerList.offer && offerList.offer.length > 0) {
        let carousel = this.createCarouselFromOfferList(offerList);
        let reply = msg.createReply(carousel);
        this.citizen.send(reply)
          .then(mid => console.log('replied %s', mid))
          .catch(err => console.log('reply error: %s', err));
      } else {
        this.reply(msg, NOT_FOUND_OFFER_TEXT);
      }
    }).catch(error => {
      console.error('error retrieving offer list' + error);
    });
  }

  createCarouselFromOfferList(offerList) {
    let result = {
      messageType: 'CAROUSEL',
      attachment: {}
    };

    result.attachment.carousel = offerList.offer.map((offer) => {
      let sellerName = '';

      if (offer.offer.seller.sellername) {
        sellerName = ' em ' + offer.offer.seller.sellername;
      }

      let item = {
        title: offer.offer.offername,
        subtitle: 'Preço: R$ ' + offer.offer.price.value + sellerName,
        actions: [{
          title: 'Comprar',
          url: offer.offer.links[0].link.url
        }]
      };
      return item;
    });
    return result;
  }

  reply(msg, text) {
    this.citizen.send(msg.createReply({
      text: text
    })).then(mid => console.log('replied %s', mid))
      .catch(err => console.log('reply error: %s', err));
  }
}

module.exports = MessageHandler;
