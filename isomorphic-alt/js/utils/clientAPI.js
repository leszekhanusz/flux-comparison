var io = require('socket.io-client');
var config = require('../../config.js');

var socket = io('localhost:' + config.port);

console.log('emit ping');

socket.emit('ping', 'blah', function (data) {
    console.log(' received ' + data);
});
