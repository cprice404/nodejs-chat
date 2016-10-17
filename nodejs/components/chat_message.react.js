/** @jsx React.DOM */

"use strict";

const React = require('react');

const ChatMessage = React.createClass({
    render: function() {
        var message = this.props.message;
        return (
            <li key={message._id} className="message active">
                <blockquote>
                    <cite>
                        <span className="timestamp">{message.timestamp.toLocaleTimeString()}</span>
                        <span className="username">{message.username}</span>
                    </cite>
                    <span className="content">{message.message}</span>
                </blockquote>
            </li>
        )

    }
});

module.exports = ChatMessage