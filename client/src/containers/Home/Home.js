"use strict";
exports.__esModule = true;
exports.Home = void 0;
var React = require("react");
var WelcomeCarousel_1 = require("../../components/WelcomeCarousel/WelcomeCarousel");
var NavigationBar_1 = require("../../components/NavigationBar/NavigationBar");
var styles_1 = require("@material-ui/core/styles");
var core_1 = require("@material-ui/core");
var useStyles = styles_1.makeStyles(function () { return ({
    root: {
        minHeight: '100vh',
        backgroundImage: "url(" + (process.env.PUBLIC_URL + '/assets/bg.jpg') + ")",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    title: {
        color: 'black'
    }
}); });
exports.Home = function () {
    var classes = useStyles();
    return (React.createElement("div", { className: classes.root },
        React.createElement(core_1.CssBaseline, null),
        React.createElement(NavigationBar_1.NavigationBar, null),
        React.createElement(core_1.Grid, { container: true, justify: "center", spacing: 0, alignItems: "center", style: { minHeight: '100vh' } },
            React.createElement(WelcomeCarousel_1.WelcomeCarousel, null))));
};
