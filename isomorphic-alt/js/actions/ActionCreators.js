'use strict';

var alt = require('../alt');
var WebAPIUtils = require('../utils/WebAPIUtils');
var env = require('../utils/env.js');

if (env.SERVER) {
  console.log('SERVER DETECTED');
}

if (env.CLIENT) {
  console.log('CLIENT DETECTED');
}

class ActionsCreators {
    constructor() {
        this.generateActions(
            'receiveProducts',
            'addToCart',
            'finishCheckout'
        );
    }

    cartCheckout(products) {
        this.dispatch(products);
        WebAPIUtils.checkoutProducts(products);
    }
}

alt.createActions(ActionsCreators, exports);
