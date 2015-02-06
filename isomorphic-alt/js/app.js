'use strict';

require('es5-shim');
require('es5-shim/es5-sham');

var React = require('react');
var App = require('./components/App.jsx');
var clientAPI = require('./utils/clientAPI.js');

var Iso = require('iso');
var alt = require('./alt');

alt.dispatcher.register(function (data) {
    console.log(data.action.toString() + ' : ' + JSON.stringify(data.data));
});

Iso.bootstrap(function (state, meta, container) {
    alt.bootstrap(state);
    React.render(React.createElement(App), container);
});
