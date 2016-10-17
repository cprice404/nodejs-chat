/** @jsx React.DOM */

'use strict'

const React = require('react');
const ChatMessage = require('./chat_message.react');

const ChatMessages = React.createClass({
    render: function() {
        var content = this.props.messages.map(function(message) {
           return (
             <ChatMessage key={message._id} message={message} />
           );
        });

        return (
            <ul className="messages">{content}</ul>
        )
    }
});

module.exports = ChatMessages;