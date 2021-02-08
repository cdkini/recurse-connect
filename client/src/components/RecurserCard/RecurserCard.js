"use strict";
exports.__esModule = true;
exports.RecurserCard = void 0;
var React = require("react");
var styles_1 = require("@material-ui/core/styles");
var Card_1 = require("@material-ui/core/Card");
var CardHeader_1 = require("@material-ui/core/CardHeader");
var CardContent_1 = require("@material-ui/core/CardContent");
var CardActions_1 = require("@material-ui/core/CardActions");
var Avatar_1 = require("@material-ui/core/Avatar");
var IconButton_1 = require("@material-ui/core/IconButton");
var Typography_1 = require("@material-ui/core/Typography");
var GitHub_1 = require("@material-ui/icons/GitHub");
var Twitter_1 = require("@material-ui/icons/Twitter");
var Email_1 = require("@material-ui/icons/Email");
var MoreVert_1 = require("@material-ui/icons/MoreVert");
var core_1 = require("@material-ui/core");
var useStyles = styles_1.makeStyles(function (theme) {
    return styles_1.createStyles({
        root: {
            maxWidth: 345
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
exports.RecurserCard = function (_a) {
    var profileID = _a.profileID;
    var _b = React.useState({}), userData = _b[0], setUserData = _b[1];
    React.useEffect(function () {
        fetch('/api/v1/users/' + profileID.toString())
            .then(function (res) { return res.json(); })
            .then(function (data) {
            setUserData(data);
        });
    }, []);
    console.log(userData);
    var classes = useStyles();
    return (React.createElement(Card_1["default"], { className: classes.root },
        React.createElement(CardHeader_1["default"], { avatar: React.createElement(Avatar_1["default"], { "aria-label": "recipe", className: classes.avatar, src: "https://assets.recurse.com/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYzQ9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--73e1a6bd523e701f4c4c92f06b33d99636886370/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9MY21WemFYcGxTU0lNTVRVd2VERTFNQVk2QmtWVSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--d8f54fe211cbe3254ece86a55c83c4d5b374eaab/IMG-2975.jpg" }, "R"), action: React.createElement(IconButton_1["default"], { "aria-label": "settings" },
                React.createElement(MoreVert_1["default"], null)), title: "Chetan Kini", subheader: "Winter 2, 2021" }),
        React.createElement(CardContent_1["default"], null,
            React.createElement(Typography_1["default"], { variant: "body2", color: "textSecondary", component: "p" }, "Interests: Python"),
            React.createElement(Typography_1["default"], { variant: "body2", color: "textSecondary", component: "p" }, "Text goes here!"),
            React.createElement(Typography_1["default"], { variant: "body2", color: "textSecondary", component: "p" }, "Text goes here!")),
        React.createElement(CardActions_1["default"], { disableSpacing: true },
            React.createElement(IconButton_1["default"], null,
                React.createElement(GitHub_1["default"], null)),
            React.createElement(IconButton_1["default"], null,
                React.createElement(Twitter_1["default"], null)),
            React.createElement(IconButton_1["default"], null,
                React.createElement(Email_1["default"], null)),
            React.createElement(core_1.Button, { variant: "contained", className: classes.expand }, "Learn more"))));
};
