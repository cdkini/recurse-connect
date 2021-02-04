'use strict';
var __assign =
	(this && this.__assign) ||
	function() {
		__assign =
			Object.assign ||
			function(t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
exports.__esModule = true;
require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
var React = require('react');
var Discover_1 = require('../Discover/Discover');
var Home_1 = require('../Home/Home');
var Network_1 = require('../Network/Network');
var Overview_1 = require('../Overview/Overview');
var ProtectedRoute_1 = require('../../components/ProtectedRoute/ProtectedRoute');
var react_router_dom_1 = require('react-router-dom');
var SessionContext_1 = require('../../contexts/SessionContext/SessionContext');
// https://stackoverflow.com/questions/59422159/redirecting-a-user-to-the-page-they-requested-after-successful-authentication-wi/59423442#59423442
var App = function() {
	var _a = SessionContext_1.useSessionContext(),
		sessionContext = _a[0],
		updateSessionContext = _a[1];
	var setRedirectPathOnAuthentication = function(path) {
		updateSessionContext(
			__assign(__assign({}, sessionContext), {
				redirectPathOnAuthentication: path,
			}),
		);
	};
	var defaultProtectedRouteProps = {
		isAuthenticated: !!sessionContext.isAuthenticated,
		authenticationPath: '/login',
		redirectPathOnAuthentication:
			sessionContext.redirectPathOnAuthentication || '',
		setRedirectPathOnAuthentication: setRedirectPathOnAuthentication,
	};
	return React.createElement(
		'div',
		null,
		React.createElement(
			react_router_dom_1.Switch,
			null,
			React.createElement(react_router_dom_1.Route, {
				path: '/',
				exact: true,
				component: Home_1.Home,
			}),
			React.createElement(
				ProtectedRoute_1.ProtectedRoute,
				__assign({}, defaultProtectedRouteProps, {
					path: '/overview',
					exact: true,
					component: Overview_1.Overview,
				}),
			),
			React.createElement(
				ProtectedRoute_1.ProtectedRoute,
				__assign({}, defaultProtectedRouteProps, {
					path: '/discover',
					exact: true,
					component: Discover_1.Discover,
				}),
			),
			React.createElement(
				ProtectedRoute_1.ProtectedRoute,
				__assign({}, defaultProtectedRouteProps, {
					path: '/network',
					exact: true,
					component: Network_1.Network,
				}),
			),
			React.createElement(react_router_dom_1.Route, { path: '/login' }),
			React.createElement(react_router_dom_1.Route, {
				path: '/',
				render: function() {
					return React.createElement('div', null, '404 Not Found');
				},
			}),
		),
	);
};
exports['default'] = App;
