// an Isomorphic helper
let Iso = require('iso');

let React = require('react');
let express = require('express');
let path = require('path');

let config = require('./config');
let App = require('./js/components/App.jsx');
let WebAPIUtils = require('./js/utils/WebAPIUtils');
var ActionCreators = require('./js/actions/ActionCreators');
let alt = require('./js/alt');

// Adding debugging info in console
alt.dispatcher.register(function (data) {
    console.log(data.action.toString() + ' : ' + JSON.stringify(data.data));
});

let app = express();

let http = require('http');

// Static directories to make css and js work
app.use('/build', express.static(path.join(__dirname, 'build')))
app.use('/common', express.static(path.join(__dirname, '..', 'common')))

// I pulled this from index.html
let htmlStart = `
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Alt Flux Sample</title>

    <link rel="shortcut icon" type="image/png" href="../common/assets/react.png">
    <link rel="stylesheet" href="../common/css/uikit.almost-flat.min.css">
    <link rel="stylesheet" href="../common/css/main.css">
</head>
<body>
`;
let htmlEnd =  `
    <script src="build/bundle.js"></script>
</body>
</html>
`;

// Pull all the products using our WebAPIUtils
// we have wrapped them up in promises but this interface can be anything
// else: callbacks, generators, async/await.
WebAPIUtils.getAllProducts().then((products) => {

    // There are two ways we can get the data in at this point
    // we can fire off the action which we're sure is a synchronous op
    // or we can use alt's bootstrap which is also synchronous.
    //
    // let data = { ProductStore: { products } };
    // alt.bootstrap(JSON.stringify(data));
    //
    // Here we will fire the action to allow the products to be indexed at reception

    ActionCreators.receiveProducts(products);

}).catch((e) => {
    console.log(e);
});

// Bootstrap our flux stores, create the markup, send it to iso.
app.get('/', (req, res) => {
    try {
        // This creates the markup that we'll use to pass into Iso
        let markup = React.renderToString(React.createElement(App));

        // here we use `alt.flush` in order to flush the data out of the stores
        // for the next request.
        //let body = Iso.render(markup, alt.flush());
        let body = Iso.render(markup, alt.takeSnapshot());

        // and we send down the markup
        res.send(`${htmlStart}${body}${htmlEnd}`);
    } catch (e) {
        // Naive error handling in case something goes wrong
        res.send(e.stack);
    }
});

app.server = http.createServer(app);
app.server.listen(config.port, () => {
    console.log('Listening on port ' + config.port);
});

require('./serverAPI.js')(app.server);
