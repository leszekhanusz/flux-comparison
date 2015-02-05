
function serverAPI (http) {
    let io = require('socket.io')(http);

    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on('ping', function (data, fn) {
            console.log(' ping received');
            fn('pong');
        });
    });
}

module.exports = serverAPI;
