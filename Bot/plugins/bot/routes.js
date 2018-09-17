var hapiExtension = require("./hapi-extensions");
var botHandler = require("./bot").botHandler;
exports.default = function(server){
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply('api index');
        }
    });

    server.route({
        method: 'POST',
        path: '/api/messages',
        handler: function (request, reply) {
            var wrappedResponse = hapiExtension.responseWrapper(request.raw.res);
            var wrappedRequest = hapiExtension.requestWrapper(request);
            botHandler(wrappedRequest, wrappedResponse); // Forwarded!!!
        }
    });
}