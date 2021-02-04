"use strict";
exports.__esModule = true;
exports.Login = void 0;
var React = require("react");
var NavigationBar_1 = require("../../components/NavigationBar/NavigationBar");
exports.Login = function () {
    var _a = React.useState(0), temp = _a[0], setTemp = _a[1];
    React.useEffect(function () {
        fetch('/api/v1/login')
            .then(function (res) { return res.json(); })
            .then(function (data) {
            setTemp(data);
        });
    }, []);
    console.log(temp);
    return (React.createElement("div", null,
        React.createElement(NavigationBar_1.NavigationBar, null),
        React.createElement("div", null, "Login")));
};
