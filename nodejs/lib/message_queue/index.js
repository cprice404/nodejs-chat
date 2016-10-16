"use strict";

const message_queue = require('./message_queue')
const message = require('./models/message')

module.exports = {
    MessageQueue: message_queue.MessageQueue,
    Message: message.Message,
}
exports.funk = function() {
    console.log("FUNK!")
}