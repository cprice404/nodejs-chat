"use strict";

const MAX_MESSAGES = 10;

var MessageQueue = function(logger) {
    if (!logger) {
        throw new Error('Missing required argument to MessageQueue constructor: `logger`')
    }
    this.messages = []
    this.log = logger
}

MessageQueue.prototype.latestMessages = function() {
    return this.messages;
}

MessageQueue.prototype.submit= function(message) {
    this.messages.push(message)
    if (this.messages.length > MAX_MESSAGES) {
        this.messages.shift()
    }
    this.log.debug("Messages length is now: " + this.messages.length)
}


exports.MessageQueue = MessageQueue;