"use strict";

const Uuid = require('uuid');

var Message = function(server_id, type, user, message, timestamp) {
    this.server_id = server_id;
    this.message_id = Uuid.v4();
    this.type = type;
    this.user = user;
    this.message = message;
    this.timestamp = timestamp;
}

exports.Message = Message;