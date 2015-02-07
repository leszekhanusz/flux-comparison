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
        products.forEach(product => this.products[product.id] = product, this);
    }

    onFinishCheckout(products) {
        products.forEach(product => {
            let quantity = product.quantity;
            let id = product.id;

            if (id in this.products) {
                this.products[id].inventory -= quantity;
            } else {
                console.log('Error: trying to checkout item which does not exist: ' + id );
            }
        },this);
    };
}

module.exports = alt.createStore(ProductStore, 'ProductStore');
