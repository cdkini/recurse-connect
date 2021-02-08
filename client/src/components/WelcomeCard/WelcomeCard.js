"use strict";
exports.__esModule = true;
exports.WelcomeCard = void 0;
var React = require("react");
var styles_1 = require("@material-ui/core/styles");
var Card_1 = require("@material-ui/core/Card");
var core_1 = require("@material-ui/core");
// import CardHeader from '@material-ui/core/CardHeader';
var CardContent_1 = require("@material-ui/core/CardContent");
// import CardActions from '@material-ui/core/CardActions';
// import Avatar from '@material-ui/core/Avatar';
// import IconButton from '@material-ui/core/IconButton';
var Typography_1 = require("@material-ui/core/Typography");
var WelcomeAccordion_1 = require("../WelcomeAccordion/WelcomeAccordion");
var GitHub_1 = require("@material-ui/icons/GitHub");
// import TwitterIcon from '@material-ui/icons/Twitter';
// import EmailIcon from '@material-ui/icons/Email';
// import MoreVertIcon from '@material-ui/icons/MoreVert';
var useStyles = styles_1.makeStyles(function (theme) {
    return styles_1.createStyles({
        root: {
            maxWidth: 1000,
            width: 750,
            height: 500
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
exports.WelcomeCard = function (_a) {
    var classes = useStyles();
    return (React.createElement(Card_1["default"], { className: classes.root },
        React.createElement(CardContent_1["default"], null,
            React.createElement(Typography_1["default"], { variant: "h3" }, "Welcome to Recurse Connect!"),
            React.createElement(Typography_1["default"], null, "From BFS to BFF's"),
            React.createElement(Typography_1["default"], null, "Recurse Connect uses the Recurse Center API to visualize connections between participants; use it to reconnect with old friends or perhaps discover some new ones!"),
            React.createElement(Typography_1["default"], null, "Navigation is done through the app bar; here's a sneak peek of what you'll find:")),
        React.createElement(WelcomeAccordion_1.WelcomeAccordion, null),
        React.createElement(core_1.CardMedia, null),
        React.createElement(core_1.Button, { variant: "contained", color: "primary" }, "Login"),
        React.createElement(core_1.IconButton, null,
            React.createElement(GitHub_1["default"], null))));
};
