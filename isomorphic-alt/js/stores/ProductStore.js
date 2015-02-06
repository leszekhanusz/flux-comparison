'use strict';

var alt = require('../alt');

var ActionCreators = require('../actions/ActionCreators');

class ProductStore {
    constructor() {
        this.bindActions(ActionCreators);
        this.products = {};
    }

    static getInventory(id) {
        var products = this.getState().products;
        return id in products ? products[id].inventory : 0;
    };

    onReceiveProducts(products) {
        // allow direct access to product from id
        products.forEach(function (product) {
            this.products[product.id] = product;
        }.bind(this));
    }

    onFinishCheckout(products) {
        products.forEach(function (product) {
            let quantity = product.quantity;
            let id = product.id;

            if (id in this.products) {
                this.products[id].inventory -= quantity;
            } else {
                console.log('Error: trying to checkout item which does not exist: ' + id );
            }
        }.bind(this));
    };
}

module.exports = alt.createStore(ProductStore, 'ProductStore');
