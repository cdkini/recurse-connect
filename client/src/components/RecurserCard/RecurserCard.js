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
			maxWidth: 800,
			width: 500,
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
			title: props.node.name + ' (' + props.node.batchShortName + ')',
			subheader: props.node.company
				? props.node.location + ' | @' + props.node.company
				: props.node.location,
		}),
		React.createElement(
			CardContent_1['default'],
			null,
			React.createElement(
				Typography_1['default'],
				{ variant: 'body2', color: 'textSecondary', component: 'p' },
				React.createElement('b', null, 'Interests:'),
				' ',
				props.node.interests
					? props.node.interests
					: React.createElement(
							'i',
							null,
							'Set up a coffee chat and see what you have in common!',
					  ),
			),
			React.createElement('br', null),
			React.createElement(
				Typography_1['default'],
				{ variant: 'body2', color: 'textSecondary', component: 'p' },
				React.createElement('b', null, 'Before RC:'),
				' ',
				props.node.beforeRc
					? props.node.beforeRc
					: React.createElement(
							'i',
							null,
							'Send a ping over Zulip to get to know your fellow Recurser!',
					  ),
			),
			React.createElement('br', null),
			React.createElement(
				Typography_1['default'],
				{ variant: 'body2', color: 'textSecondary', component: 'p' },
				React.createElement('b', null, 'During RC:'),
				' ',
				props.node.duringRc
					? props.node.duringRc
					: React.createElement(
							'i',
							null,
							'Why not discuss plans over a pairing session or two?',
					  ),
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
