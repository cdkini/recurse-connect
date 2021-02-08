"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.ProtectedRoute = void 0;
var React = require("react");
var react_router_1 = require("react-router");
exports.ProtectedRoute = function (props) {
    var currentLocation = react_router_1.useLocation();
    var redirectPath = props.redirectPathOnAuthentication;
    if (!props.isAuthenticated) {
        props.setRedirectPathOnAuthentication(currentLocation.pathname);
        redirectPath = props.authenticationPath;
    }
    if (redirectPath !== currentLocation.pathname) {
        var renderComponent = function () { return React.createElement(react_router_1.Redirect, { to: { pathname: redirectPath } }); };
        return React.createElement(react_router_1.Route, __assign({}, props, { component: renderComponent, render: undefined }));
    }
    else {
        return React.createElement(react_router_1.Route, __assign({}, props));
    }
};
exports["default"] = exports.ProtectedRoute;
