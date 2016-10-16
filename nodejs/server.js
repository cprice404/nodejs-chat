'use strict';

const Hapi = require('hapi');
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

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            console.log("Got request matching route")
            return reply.file(INDEX)
        }
    })
})


server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri)
})
