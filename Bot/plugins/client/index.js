'use strict';

var routes = require("./routes.js").default
exports.register = function (server, options, next) {
    console.log("Client Registered");
    routes(server);
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};