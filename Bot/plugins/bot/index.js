'use strict';

var routes = require("./routes.js").default
var botDialogs = require("./bot-dialog").default;
exports.register = function (server, options, next) {
    console.log("Registered");
    routes(server);
    botDialogs();
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};