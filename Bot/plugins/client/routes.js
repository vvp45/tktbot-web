var path = require("path");
exports.default = function(server){
    server.route({
        method: 'GET',
        path: '/client/{param*}',
        handler: {
            directory: {
                path: path.join('public')
            }
        }
    });
}