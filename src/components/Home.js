"use strict";
exports.__esModule = true;
exports.Home = void 0;
var React = require("react");
var NavigationBar_1 = require("./NavigationBar");
var Home = function () {
    var _a = React.useState(0), currentTest = _a[0], setCurrentTest = _a[1];
    React.useEffect(function () {
        fetch('/test')
            .then(function (res) { return res.json(); })
            .then(function (data) {
            setCurrentTest(data.test);
        });
    }, []);
    return (React.createElement("div", null,
        React.createElement(NavigationBar_1.NavigationBar, null),
        React.createElement("div", null, "Home"),
        React.createElement("div", null, currentTest)));
};
exports.Home = Home;
