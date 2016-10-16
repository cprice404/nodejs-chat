'use strict';

const Hapi = require('hapi');
const Good = require('good');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'public', 'index.html');

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: PORT
})

server.register(require('inert'), (err) => {
    if (err) {
        throw err
    }
})

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {
    if (err) {
        throw err;
    }
})

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        return reply.file(INDEX)
    }
})


server.start((err) => {
    if (err) {
        throw err;
    }
    server.log('info', 'Server running at:' + server.info.uri)
})
