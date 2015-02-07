'use strict';

var React = require('react');
var ProductItem = require('../../../common/components/ProductItem.jsx');
var ProductsList = require('../../../common/components/ProductsList.jsx');
var ProductStore = require('../stores/ProductStore');
var CartStore = require('../stores/CartStore');
var ActionCreators = require('../actions/ActionCreators');
var assign = require('object-assign');

function _getStateFromStores () {
    // Here, we are fetching the contents of the products in the inventory in ProductStore
    // and the contents of the products in the cart in CartStore
    // and are merging both to have a single products state with inventory
    // because now the ProductStore is not decrementing inventory with onAddToCart
    // but only after finishCheckout
    let productsInventory = ProductStore.getState().products;
    let cartContent = CartStore.getState().products;

    let products = Object.keys(productsInventory).map(function (id) {
        // Why do I need this assign ? I thougth store were immutables ??
        // Answer: the stores are sending shallow copies instead of deep copies of the data with the getState function
        //         ==> It is still possible to modify the content of the stores in the views
        let product = assign({}, productsInventory[id]);

        if (id in cartContent) {
            product.inventory -= cartContent[id].quantity;
        }

        return product;
    });

    return {products: products};
}

var ProductItemContainer = React.createClass({
    onAddToCartClicked: function () {
        ActionCreators.addToCart(this.props.product);
    },

    render: function () {
        return (
            <ProductItem product={this.props.product} onAddToCartClicked={this.onAddToCartClicked} />
        );
    }
});

var ProductsListContainer = React.createClass({
    getInitialState: function () {
        return _getStateFromStores();
    },

    componentDidMount: function () {
        ProductStore.listen(this._onChange);
        CartStore.listen(this._onChange);
    },

    componentWillUnmount: function () {
        ProductStore.unlisten(this._onChange);
        CartStore.unlisten(this._onChange);
    },

    render: function () {
        var nodes = this.state.products.map(function (product) {
            return <ProductItemContainer key={product.id} product={product} />;
        });

        return (
            <ProductsList title="Flux Shop Demo (Alt)">
                {nodes}
            </ProductsList>
        );
    },

    _onChange: function () {
        this.setState(_getStateFromStores());
    }
});

module.exports = ProductsListContainer;
