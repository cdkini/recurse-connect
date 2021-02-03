'use strict';
exports.__esModule = true;
require('../node_modules/bootstrap/dist/css/bootstrap.min.css');
var React = require('react');
var Home_1 = require('./components/Home');
var Overview_1 = require('./components/Overview');
var Discover_1 = require('./components/Discover');
var Network_1 = require('./components/Network');
var react_router_dom_1 = require('react-router-dom');
var App = function() {
	return React.createElement(
		react_router_dom_1.BrowserRouter,
		null,
		React.createElement(
			react_router_dom_1.Switch,
			null,
			React.createElement(react_router_dom_1.Route, {
				path: '/',
				exact: true,
				component: Home_1.Home,
			}),
			React.createElement(react_router_dom_1.Route, {
				path: '/overview',
				exact: true,
				component: Overview_1.Overview,
			}),
			React.createElement(react_router_dom_1.Route, {
				path: '/discover',
				exact: true,
				component: Discover_1.Discover,
			}),
			React.createElement(react_router_dom_1.Route, {
				path: '/network',
				exact: true,
				component: Network_1.Network,
			}),
			React.createElement(react_router_dom_1.Route, {
				path: '/',
				render: function() {
					return React.createElement('div', null, '404');
				},
			}),
		),
	);
};
exports['default'] = App;
