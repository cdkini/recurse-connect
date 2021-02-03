'use strict';
exports.__esModule = true;
var React = require('react');
var ReactDOM = require('react-dom');
var App_1 = require('./containers/App');
var SessionContext_1 = require('./contexts/SessionContext');
var react_router_dom_1 = require('react-router-dom');
var createApp = function() {
	return React.createElement(
		react_router_dom_1.BrowserRouter,
		null,
		React.createElement(
			SessionContext_1.SessionContextProvider,
			null,
			React.createElement(App_1['default'], null),
		),
	);
};
ReactDOM.render(createApp(), document.getElementById('root'));
