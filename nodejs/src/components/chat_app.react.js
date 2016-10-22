/** @jsx React.DOM */

'use strict'

const React = require('react');
const ChatMessages = require('./chat_messages.react')

const ChatApp = React.createClass({
    getInitialState: function(props) {
        props = props ||  this.props

        return {
            messages: props.messages
        }

    },

    render: function() {
        return (
            <div className="chat-app">
                <ChatMessages messages={this.state.messages} />
            </div>
        )
    }
});

module.exports = ChatApp