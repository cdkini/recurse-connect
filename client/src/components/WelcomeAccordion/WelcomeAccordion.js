"use strict";
exports.__esModule = true;
exports.WelcomeAccordion = void 0;
var React = require("react");
var styles_1 = require("@material-ui/core/styles");
var Accordion_1 = require("@material-ui/core/Accordion");
var AccordionDetails_1 = require("@material-ui/core/AccordionDetails");
var AccordionSummary_1 = require("@material-ui/core/AccordionSummary");
var Typography_1 = require("@material-ui/core/Typography");
var ExpandMore_1 = require("@material-ui/icons/ExpandMore");
var useStyles = styles_1.makeStyles(function (theme) {
    return styles_1.createStyles({
        root: {
            width: '80%'
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary
        }
    });
});
exports.WelcomeAccordion = function (_a) {
    var classes = useStyles();
    var _b = React.useState(false), expanded = _b[0], setExpanded = _b[1];
    var handleChange = function (panel) { return function (_event, isExpanded) {
        setExpanded(isExpanded ? panel : false);
    }; };
    return (React.createElement("div", { className: classes.root },
        React.createElement(Accordion_1["default"], { expanded: expanded === 'panel1', onChange: handleChange('panel1') },
            React.createElement(AccordionSummary_1["default"], { expandIcon: React.createElement(ExpandMore_1["default"], null), "aria-controls": "panel1bh-content", id: "panel1bh-header" },
                React.createElement(Typography_1["default"], { className: classes.heading }, "Feed"),
                React.createElement(Typography_1["default"], { className: classes.secondaryHeading }, "See what your fellow Recursers are up to")),
            React.createElement(AccordionDetails_1["default"], null,
                React.createElement(Typography_1["default"], null, "More details about Feed"))),
        React.createElement(Accordion_1["default"], { expanded: expanded === 'panel2', onChange: handleChange('panel2') },
            React.createElement(AccordionSummary_1["default"], { expandIcon: React.createElement(ExpandMore_1["default"], null), "aria-controls": "panel2bh-content", id: "panel2bh-header" },
                React.createElement(Typography_1["default"], { className: classes.heading }, "Network"),
                React.createElement(Typography_1["default"], { className: classes.secondaryHeading }, "Get to know your immediate network better")),
            React.createElement(AccordionDetails_1["default"], null,
                React.createElement(Typography_1["default"], null, "More details about Network"))),
        React.createElement(Accordion_1["default"], { expanded: expanded === 'panel3', onChange: handleChange('panel3') },
            React.createElement(AccordionSummary_1["default"], { expandIcon: React.createElement(ExpandMore_1["default"], null), "aria-controls": "panel3bh-content", id: "panel3bh-header" },
                React.createElement(Typography_1["default"], { className: classes.heading }, "Discover"),
                React.createElement(Typography_1["default"], { className: classes.secondaryHeading }, "Broaden your horizons and make a new friend")),
            React.createElement(AccordionDetails_1["default"], null,
                React.createElement(Typography_1["default"], null, "More details about Discover")))));
};
