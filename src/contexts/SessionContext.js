'use strict';
exports.__esModule = true;
exports.SessionContextProvider = exports.useSessionContext = exports.SessionContext = void 0;
var react_1 = require('react');
var session_1 = require('../models/session');
var React = require('react');
exports.SessionContext = react_1.createContext([
	session_1.initialSession,
	function() {},
]);
var useSessionContext = function() {
	return react_1.useContext(exports.SessionContext);
};
exports.useSessionContext = useSessionContext;
var SessionContextProvider = function(props) {
	var _a = react_1.useState(session_1.initialSession),
		sessionState = _a[0],
		setSessionState = _a[1];
	var defaultSessionContext = [sessionState, setSessionState];
	return React.createElement(
		exports.SessionContext.Provider,
		{ value: defaultSessionContext },
		props.children,
	);
};
exports.SessionContextProvider = SessionContextProvider;
