/** @jsx React.DOM */

"use strict";

const React = require('react');

const ChatMessage = React.createClass({
    render: function() {
        var message = this.props.message;
        return (
            <li className="message active">
                <blockquote>
                    <cite>
                        <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
                        <span className="username">{message.user}</span>
                    </cite>
                    <span className="content">{message.message}</span>
                </blockquote>
            </li>
        )

    }
});

module.exports = ChatMessage