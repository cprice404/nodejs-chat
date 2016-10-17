/** @jsx React.DOM */

'use strict'

const React = require('react');

const ChatApp = React.createClass({
    render: function() {
        return (
            <div className="chat-app">
                <h1>Hello from Chat app!</h1>
            </div>
        )
    }
});

module.exports = ChatApp