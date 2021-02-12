"use strict";
exports.__esModule = true;
exports.RecurserCard = void 0;
var React = require("react");
var Avatar_1 = require("@material-ui/core/Avatar");
var Card_1 = require("@material-ui/core/Card");
var CardActions_1 = require("@material-ui/core/CardActions");
var CardContent_1 = require("@material-ui/core/CardContent");
var CardHeader_1 = require("@material-ui/core/CardHeader");
var Email_1 = require("@material-ui/icons/Email");
var GitHub_1 = require("@material-ui/icons/GitHub");
var IconButton_1 = require("@material-ui/core/IconButton");
var Twitter_1 = require("@material-ui/icons/Twitter");
var Typography_1 = require("@material-ui/core/Typography");
var core_1 = require("@material-ui/core");
var styles_1 = require("@material-ui/core/styles");
var useStyles = styles_1.makeStyles(function (theme) {
    return styles_1.createStyles({
        root: {
            maxWidth: 400,
            width: 400
        },
        media: {
            height: 0,
            paddingTop: '56.25%'
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest
            })
        },
        avatar: {
            width: theme.spacing(7),
            height: theme.spacing(7)
        }
    });
});
exports.RecurserCard = function (props) {
    var classes = useStyles();
    var handlePageChange = function (url) {
        return function () {
            if (typeof url === 'string') {
                window.open('http://' + url, '_blank');
            }
            else {
                // TODO: Alert saying not available!
            }
        };
    };
    var handleEmail = function () {
        var email = props.node.email;
        if (typeof email === 'string') {
            // Alert saying email
        }
        else {
            // Alert saying no email
        }
    };
    return (React.createElement(Card_1["default"], { className: classes.root },
        React.createElement(CardHeader_1["default"], { avatar: React.createElement(Avatar_1["default"], { "aria-label": "profilePic", className: classes.avatar, src: props.node.imagePath }, "RC"), title: props.node.name, subheader: props.node.batch }),
        React.createElement(CardContent_1["default"], null,
            React.createElement(Typography_1["default"], { variant: "body2", color: "textSecondary", component: "p" }, "Interests: Python"),
            React.createElement(Typography_1["default"], { variant: "body2", color: "textSecondary", component: "p" }, "Text goes here!"),
            React.createElement(Typography_1["default"], { variant: "body2", color: "textSecondary", component: "p" }, "Text goes here!")),
        React.createElement(CardActions_1["default"], { disableSpacing: true },
            React.createElement(IconButton_1["default"], null,
                React.createElement(GitHub_1["default"], { onClick: handlePageChange(props.node.github) })),
            React.createElement(IconButton_1["default"], null,
                React.createElement(Twitter_1["default"], { onClick: handlePageChange(props.node.twitter) })),
            React.createElement(IconButton_1["default"], null,
                React.createElement(Email_1["default"], { onClick: handleEmail })),
            React.createElement(core_1.Button, { variant: "contained", className: classes.expand }, "Learn more"))));
};
