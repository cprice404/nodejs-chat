'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Good = require('good');
const Path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = Path.join(__dirname, 'public', 'index.html');
const LATEST_MESSAGES_NUM_MESSAGES = 10;

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


var messages = []

server.route([
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            return reply.file(INDEX)
        }
    },
    {
        method: 'GET',
        path: '/latest-messages',
        handler: function(request, reply) {
            return reply(messages)
        }
    },
    {
        method: 'POST',
        path: '/submit-message',
        config: {
            // Disable automatic JSON parsing and take care of it in the handler
            // to provide more control over performance.  Might also be worth
            // playing with 'stream' output setting.
            payload: {
                parse: false,
                output: 'data'
            },
            validate: {
                headers: Joi.object({
                    'content-type': Joi.string().valid("application/json").required()
                }).options({ allowUnknown: true})
            },
            handler: function (request, reply) {
                var message = JSON.parse(request.payload)

                messages.push(message)
                if (messages.length > LATEST_MESSAGES_NUM_MESSAGES) {
                    messages.shift()
                }
                server.log('debug', "Messages length is now: " + messages.length)
                server.log('debug', "Got message: '" + message.message + "'")
                return reply(message.message)
            }
        }
    }
])

server.start((err) => {
    if (err) {
        throw err;
    }
    server.log('info', 'Server running at:' + server.info.uri)
})
