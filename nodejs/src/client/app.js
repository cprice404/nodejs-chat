/** @jsx React.DOM */

const React = require('react');
const ReactDOM = require('react-dom');
const ChatApp = require('../components/chat_app.react');

// Snag the initial state that was passed from the server side
const initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

//// Render the components, picking up where react left off on the server
ReactDOM.render(
    <ChatApp messages={initialState}/>,
    document.getElementById('react-app')
);