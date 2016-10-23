'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Hoek = require('hoek');
const Vision = require('vision');
const Handlebars = require('handlebars');
const Good = require('good');
const Bunyan = require('bunyan');

const JSX = require('node-jsx').install();
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const Path = require('path');

const MessageQueue = require('./lib/message_queue');
const ChatApp = React.createFactory(require('./components/chat_app.react'));

const PORT = process.env.PORT || 3000;

const log = Bunyan.createLogger({
    name: 'root',
    level: 'debug'
});

const config = require('./config/dev');

const mq = new MessageQueue.MessageQueue(log, config.couchbase);

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: PORT,
    routes: {
        files: {
            relativeTo: __dirname,
        }
    }
});

server.register(require('inert'), (err) => {
    Hoek.assert(!err, err)
});

server.register({
    register: Good,
    options: {
        reporters: {
            bunyan: [{
                module: 'good-bunyan',
                args: [
                    { ops: '*', response: '*', log: '*', error: '*', request: '*'},
                    {
                        logger: log,
                        levels: {
                            request: 'info',
                            response: 'info',
                            log: 'info',
                            ops: 'debug'
                        }
                        //formatters: {
                        //    response: (data) => {
                        //        return 'Response  for ' + data.path
                        //    }
                        //}
                    }
                ]
            }]
        }
    }
}, (err) => {
    Hoek.assert(!err, err)
});

server.register(Vision, (err) => {
    Hoek.assert(!err, err);

    server.views({
        engines: {
            hbs: Handlebars
        },
        relativeTo: __dirname,
        path: 'templates',
        layoutPath: 'templates/layout',
        layout: 'default'
    });
});

server.route([
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {

            mq.latestMessages()
                .then((messages) => {
                    var markup = ReactDOMServer.renderToString(
                        ChatApp({messages: messages})
                    );
                    reply.view('index', {
                        markup: markup,
                        state: JSON.stringify(messages)
                    });
                })
                .catch((err) => {
                    log.error('Unable to retrieve latest messages: ', err);
                });
        }
    },
    {
        method: 'GET',
        path: '/css/{file*}',
        handler: {
            directory: {
                path: 'public/css'
            }
        }
    },
    {
        method: 'GET',
        path: '/js/{file*}',
        handler: {
            directory: {
                path: './public/js'
            }
        }
    },
    {
        method: 'GET',
        path: '/latest-messages',
        handler: function(request, reply) {
            mq.latestMessages()
                .then((messages) =>  {
                    reply(messages);
                })
                .catch((err) => {
                    log.error('Unable to retrieve latest messages: ', err);
                });
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
                var data = JSON.parse(request.payload);
                var message = new MessageQueue.Message(
                    server.info.host, data.type, data.user, data.message,
                    Date.now());
                mq.submit(message);

                return reply(message);
            }
        }
    }
]);

server.start((err) => {
    Hoek.assert(!err, err);
    server.log('info', 'Server running at:' + server.info.uri);
});
