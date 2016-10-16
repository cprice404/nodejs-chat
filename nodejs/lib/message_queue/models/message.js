"use strict";

var Message = function(server_id, type, user, message, timestamp) {
    this.server_id = server_id
    this.type = type
    this.user = user
    this.message = message
    this.timestamp = timestamp;
}

exports.Message = Message;