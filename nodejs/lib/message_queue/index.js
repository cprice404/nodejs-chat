"use strict";

const message_queue = require('./message_queue')
const message = require('./models/message')

module.exports = {
    MessageQueue: message_queue.MessageQueue,
    MAX_MESSAGES: message_queue.MAX_MESSAGES,
    Message: message.Message,
}
exports.funk = function() {
    console.log("FUNK!")
}