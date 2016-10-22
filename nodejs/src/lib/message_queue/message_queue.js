"use strict";

const MAX_MESSAGES = 10;

const Couchbase = require('couchbase');
const Hoek = require('hoek');

var MessageQueue = function(logger, couchbase_config) {
    if (!logger) {
        throw new Error('Missing required argument to MessageQueue constructor: `logger`')
    }
    if (!couchbase_config) {
        throw new Error('Missing required argument to MessageQueue constructor: `couchbase_config`')
    }
    this.messages = []
    this.log = logger
    this.cluster = new Couchbase.Cluster(`couchbase://${couchbase_config.hostName}`);

    // TODO: convert this and other initialization stuff to promises.
    this.bucket = this.cluster.openBucket(couchbase_config.bucket.name, null, (err) => {
        Hoek.assert(!err, err);
    })
}

MessageQueue.prototype.latestMessages = function() {
    return this.messages;
}

MessageQueue.prototype.submit= function(message) {
    this.bucket.insert(message.message_id, message, (err, result) => {
        Hoek.assert(!err, err);
        this.log.info("Saved doc: %j", result)
    });
    // TODO use promises and/or get rid of this stuff
    this.messages.push(message)
    if (this.messages.length > MAX_MESSAGES) {
        this.messages.shift()
    }
    this.log.debug("Messages length is now: " + this.messages.length)
}

// TODO: add shutdown method to disconnect bucket, plumb through to server
// shutdown.


exports.MessageQueue = MessageQueue
exports.MAX_MESSAGES = MAX_MESSAGES
