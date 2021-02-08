"use strict";
exports.__esModule = true;
exports.Home = void 0;
var React = require("react");
var WelcomeCard_1 = require("../../components/WelcomeCard/WelcomeCard");
var NavigationBar_1 = require("../../components/NavigationBar/NavigationBar");
// import { FuzzySearchBar } from '../../components/FuzzySearchBar/FuzzySearchBar';
var styles_1 = require("@material-ui/core/styles");
var core_1 = require("@material-ui/core");
var useStyles = styles_1.makeStyles(function () { return ({
    root: {
        minHeight: '100vh',
        backgroundImage: "url(" + (process.env.PUBLIC_URL + "/assets/bg.jpg") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    },
    title: {
        color: "black"
    }
}); });
exports.Home = function () {
    var classes = useStyles();
    // const theme = useTheme();
    return (React.createElement("div", { className: classes.root },
        React.createElement(core_1.CssBaseline, null),
        React.createElement(NavigationBar_1.NavigationBar, null),
        React.createElement(core_1.Grid, { container: true, justify: "center", spacing: 0, alignItems: "center", style: { minHeight: "100vh" } },
            React.createElement(WelcomeCard_1.WelcomeCard, null))));
};
