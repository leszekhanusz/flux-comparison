'use strict';

var io = require('socket.io-client');
var config = require('../../config.js');
var Promise = require('es6-promise').Promise;

var socket = io('localhost:' + config.port);

module.exports = {
    cartCheckout: function (products) {
        return new Promise(function (resolve, reject) {
            socket.emit('cartCheckout', products, function (data) {
                if (data === 'OK') {
                    resolve();
                } else {
                    reject(data);
                }
            });
        });
    }
};
