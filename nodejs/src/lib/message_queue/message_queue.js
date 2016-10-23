"use strict";

const MAX_MESSAGES = 20;

const Couchbase = require('couchbase');
const Hoek = require('hoek');
const N1qlQuery = require('couchbase').N1qlQuery;

var MessageQueue = function(logger, couchbase_config) {
    if (!logger) {
        throw new Error('Missing required argument to MessageQueue constructor: `logger`')
    }
    if (!couchbase_config) {
        throw new Error('Missing required argument to MessageQueue constructor: `couchbase_config`')
    }
    this.log = logger
    this.cluster = new Couchbase.Cluster(`couchbase://${couchbase_config.hostName}`);

    // TODO: convert this and other initialization stuff to promises.
    this.bucket = this.cluster.openBucket(couchbase_config.bucket.name, null, (err) => {
        Hoek.assert(!err, err);
    })
}

MessageQueue.prototype.latestMessages = function() {
    var query = N1qlQuery.fromString('SELECT * FROM `nodejs-chat` ORDER BY timestamp DESC LIMIT ' + MAX_MESSAGES);
    return new Promise((resolve, reject) => {
        this.bucket.query(query, (err, res) => {
            if (err) {
                this.log.warn('query failed', err);
                reject(err);
                return;
            }
            this.log.trace('success!', res);
            resolve(res.map((message) => message["nodejs-chat"]).reverse());
        });
    });
}

MessageQueue.prototype.submit = function(message) {
    this.bucket.insert(message.message_id, message, (err, result) => {
        Hoek.assert(!err, err);
        this.log.trace("Saved doc: %j", result)
    });
}

// TODO: add shutdown method to disconnect bucket, plumb through to server
// shutdown.


exports.MessageQueue = MessageQueue
