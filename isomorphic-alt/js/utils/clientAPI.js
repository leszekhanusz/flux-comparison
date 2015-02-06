'use strict';

var io = require('socket.io-client');
var config = require('../../config.js');
var Promise = require('es6-promise').Promise;

var socket = io('localhost:' + config.port);

module.exports = {
    ping: function () {
        return new Promise(function (resolve) {
            console.log('emit ping');
            socket.emit('ping', 'blah', function (data) {
                console.log(' received ' + data);
                resolve();
            });
        });
    },
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
