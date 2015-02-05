
function serverAPI (http) {
    let io = require('socket.io')(http);

    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on('ping', function (data, fn) {
            console.log(' ping received');
            fn('pong');
        });

        socket.on('cartCheckout', function (products, fn) {
            console.log(' Checkout received');
            fn('OK');
        });
    });
}

module.exports = serverAPI;
