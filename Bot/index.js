'use strict';

const Glue = require('glue');

const manifest = {
    server: {},
    connections: [
        { host: "0.0.0.0", port: 3000, labels: ["web"] }
    ],
    registrations: [
        {
            plugin: "inert",

        },
        {
            plugin: {
                register: './plugins/bot',
                options: {
                    uglify: true
                }
            }
        },
        {
            plugin: {
                register: './plugins/client',
                options: {
                    uglify: true
                }
            }
        }
    ]
};



const options = {
    relativeTo: __dirname
};

Glue.compose(manifest, options, (err, server) => {

    if (err) {
        throw err;
    }
    server.start(() => {

        console.log('hapi days!');
    });
});