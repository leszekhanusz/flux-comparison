
var ProductStore = require('./js/stores/ProductStore');
var ActionCreators = require('./js/actions/ActionCreators');

function serverAPI (http) {
    let io = require('socket.io')(http);

    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on('cartCheckout', function (productsWanted, fn) {
            console.log('YOU WANT:\n');
            console.log(productsWanted);

            let productsAvailable = ProductStore.getState().products;
            console.log('CURRENT INVENTORY IS:\n');
            console.log(productsAvailable);

            // Verify that there is enough stock for all products wanted
            let allProductsAreAvailable = productsWanted.reduce(function (prev, curr) {
                return prev && (ProductStore.getInventory(curr.id) >= curr.quantity);
            }, true);

            console.log(' Is checkout accepted:');
            if (allProductsAreAvailable) {
                console.log('   Yes');
                ActionCreators.finishCheckout(productsWanted);
                fn('OK');
            } else {
                console.log('   No: NOT ENOUGHT LEFT');
                fn('NOT ENOUGH LEFT SORRY');
            }
        });

        socket.on('error', function(e) {
            console.log('Socket IO Error: ' + e);
        });
    });
}

module.exports = serverAPI;
