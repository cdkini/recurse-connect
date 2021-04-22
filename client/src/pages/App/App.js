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
var Stats_1 = require('../Stats/Stats');
var Login_1 = require('../Login/Login');
var ProtectedRoute_1 = require('../../components/ProtectedRoute/ProtectedRoute');
var react_router_dom_1 = require('react-router-dom');
var SessionContext_1 = require('../../contexts/SessionContext/SessionContext');
var Notes_1 = require('../Notes/Notes');
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
				path: ['/', '/home'],
				exact: true,
				component: Home_1.Home,
			}),
			React.createElement(react_router_dom_1.Route, {
				path: '/stats',
				exact: true,
				component: Stats_1.Stats,
			}),
			React.createElement(react_router_dom_1.Route, {
				path: '/network',
				exact: true,
				render: function(props) {
					return React.createElement(
						Network_1.Network,
						__assign({}, props, { profileId: 3721 }),
					);
				},
			}),
			React.createElement(react_router_dom_1.Route, {
				path: '/notes',
				exact: true,
				render: function(props) {
					return React.createElement(
						Notes_1.Notes,
						__assign({}, props, { profileId: 3721 }),
					);
				},
			}),
			React.createElement(
				ProtectedRoute_1.ProtectedRoute,
				__assign({}, defaultProtectedRouteProps, {
					path: '/network',
					exact: true,
					component: Network_1.Network,
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
			React.createElement(react_router_dom_1.Route, {
				path: '/login',
				exact: true,
				component: Login_1.Login,
			}),
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
