/** @jsx React.DOM */

'use strict'

const React = require('react');
const ChatMessages = require('./chat_messages.react')

const ChatApp = React.createClass({
    getInitialState: function(props) {
      return {
          messages: [
              {
                  "_id": "msg1",
                  "username": "user1",
                  "timestamp": new Date(),
                  "message":  "hi there!"
              },
              {
                  "_id": "msg2",
                  "username": "user2",
                  "timestamp": new Date(),
                  "message":  "how's it going?"
              }
          ]
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