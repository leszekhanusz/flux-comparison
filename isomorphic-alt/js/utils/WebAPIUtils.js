'use strict';

var shop = require('../../../common/api/shop');
var ActionCreators = require('../actions/ActionCreators');
var Promise = require('es6-promise').Promise;
var env = require('./env.js');

if (env.SERVER) {
  console.log('SERVER DETECTED');
}

if (env.CLIENT) {
  var clientAPI = require('./clientAPI.js');
  console.log('CLIENT DETECTED');
}

module.exports = {
    getAllProducts: function (cb) {
        return new Promise(function (resolve) {
            shop.getProducts(resolve);
        });
    },

    checkoutProducts: function (products) {
        return clientAPI.cartCheckout()
        .then(function () {
            ActionCreators.finishCheckout(products);
            console.log('Checkout received and accepted by server');
        })
        .catch(function (error) {
            console.log(error);
        });
    }
};
