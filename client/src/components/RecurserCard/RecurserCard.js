'use strict';
exports.__esModule = true;
exports.RecurserCard = void 0;
var React = require('react');
var Avatar_1 = require('@material-ui/core/Avatar');
var Card_1 = require('@material-ui/core/Card');
var CardActions_1 = require('@material-ui/core/CardActions');
var CardContent_1 = require('@material-ui/core/CardContent');
var CardHeader_1 = require('@material-ui/core/CardHeader');
var Email_1 = require('@material-ui/icons/Email');
var GitHub_1 = require('@material-ui/icons/GitHub');
var Twitter_1 = require('@material-ui/icons/Twitter');
var Typography_1 = require('@material-ui/core/Typography');
var core_1 = require('@material-ui/core');
var styles_1 = require('@material-ui/core/styles');
var SocialMediaIcon_1 = require('../SocialMediaIcon/SocialMediaIcon');
var useStyles = styles_1.makeStyles(function(theme) {
	return styles_1.createStyles({
		root: {
			maxWidth: 400,
			width: 400,
		},
		media: {
			height: 0,
			paddingTop: '56.25%',
		},
		expand: {
			transform: 'rotate(0deg)',
			marginLeft: 'auto',
			transition: theme.transitions.create('transform', {
				duration: theme.transitions.duration.shortest,
			}),
		},
		avatar: {
			width: theme.spacing(7),
			height: theme.spacing(7),
		},
		popover: {
			pointerEvents: 'none',
		},
		paper: {
			padding: theme.spacing(1),
		},
	});
});
exports.RecurserCard = function(props) {
	var classes = useStyles();
	var containsContent = function(content) {
		return typeof content === 'string' && content.length > 0;
	};
	var handlePageChange = function(url) {
		return function() {
			if (typeof url === 'string') {
				window.open('http://' + url, '_blank');
			}
		};
	};
	return React.createElement(
		Card_1['default'],
		{ className: classes.root },
		React.createElement(CardHeader_1['default'], {
			avatar: React.createElement(
				Avatar_1['default'],
				{
					'aria-label': 'profilePic',
					className: classes.avatar,
					src: props.node.imagePath,
				},
				'RC',
			),
			title: props.node.name,
			subheader: props.node.batchName,
		}),
		React.createElement(
			CardContent_1['default'],
			null,
			React.createElement(
				Typography_1['default'],
				{ variant: 'body2', color: 'textSecondary', component: 'p' },
				'Interests: ',
				props.node.interests,
			),
			React.createElement(
				Typography_1['default'],
				{ variant: 'body2', color: 'textSecondary', component: 'p' },
				'During RC: ',
				props.node.duringRc,
			),
			React.createElement(
				Typography_1['default'],
				{ variant: 'body2', color: 'textSecondary', component: 'p' },
				'Text goes here!',
			),
		),
		React.createElement(
			CardActions_1['default'],
			{ disableSpacing: true },
			React.createElement(SocialMediaIcon_1.SocialMediaIcon, {
				contents: props.node.github,
				icon: React.createElement(GitHub_1['default'], null),
				isEmpty: !containsContent(props.node.github),
				isClickable: containsContent(props.node.github),
				handlePageChange: handlePageChange,
			}),
			React.createElement(SocialMediaIcon_1.SocialMediaIcon, {
				contents: props.node.twitter,
				icon: React.createElement(Twitter_1['default'], null),
				isEmpty: !containsContent(props.node.twitter),
				isClickable: containsContent(props.node.twitter),
				handlePageChange: handlePageChange,
			}),
			React.createElement(SocialMediaIcon_1.SocialMediaIcon, {
				contents: props.node.email,
				icon: React.createElement(Email_1['default'], null),
				isEmpty: !containsContent(props.node.email),
				isClickable: false,
				handlePageChange: handlePageChange,
			}),
			React.createElement(
				core_1.Button,
				{
					variant: 'contained',
					className: classes.expand,
					onClick: handlePageChange(props.node.profilePath),
				},
				'Learn more',
			),
		),
	);
};
