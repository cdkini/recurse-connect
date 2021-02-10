'use strict';
exports.__esModule = true;
exports.WelcomeCard = void 0;
var React = require('react');
var Card_1 = require('@material-ui/core/Card');
var CardContent_1 = require('@material-ui/core/CardContent');
var CardHeader_1 = require('@material-ui/core/CardHeader');
var Typography_1 = require('@material-ui/core/Typography');
var Public_1 = require('@material-ui/icons/Public');
var core_1 = require('@material-ui/core');
var WelcomeAccordion_1 = require('../WelcomeAccordion/WelcomeAccordion');
var styles_1 = require('@material-ui/core/styles');
var useStyles = styles_1.makeStyles(function(theme) {
	return styles_1.createStyles({
		root: {
			maxWidth: 1000,
			width: 750,
			height: 500,
			justify: 'center',
			alignItems: 'center',
			textAlign: 'center',
		},
		button: {
			margin: theme.spacing(1),
			justify: 'center',
			align: 'center',
			alignItems: 'center',
			textAlign: 'center',
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
	});
});
exports.WelcomeCard = function(_a) {
	var classes = useStyles();
	var _b = React.useState(false),
		checked = _b[0],
		setChecked = _b[1];
	var handleChange = function() {
		setChecked(function(prev) {
			return !prev;
		});
	};
	return React.createElement(
		'div',
		{ className: classes.root },
		React.createElement(
			'div',
			null,
			React.createElement(
				core_1.Fade,
				{ in: checked },
				React.createElement(
					Card_1['default'],
					null,
					React.createElement(CardHeader_1['default'], {
						title: 'Welcome to Recurse Connect!',
						subheader: "From BFS to BFF's",
					}),
					React.createElement(core_1.CardMedia, {
						className: 'media',
						image:
							'https://d29xw0ra2h4o4u.cloudfront.net/assets/logo_square-051508b5ecf8868635aea567bb86f423f4d1786776e5dfce4adf2bc7edf05804.png',
					}),
					React.createElement(
						CardContent_1['default'],
						null,
						React.createElement(
							Typography_1['default'],
							null,
							'Recurse Connect uses the Recurse Center API to visualize connections between participants; use it to reconnect with old friends or perhaps discover some new ones!',
						),
						React.createElement(
							core_1.Button,
							{ variant: 'contained', color: 'primary' },
							'Login',
						),
						React.createElement('br', null),
						React.createElement(
							Typography_1['default'],
							null,
							"Navigation is done through the app bar; here's a sneak peek of what you'll find:",
						),
					),
					React.createElement(WelcomeAccordion_1.WelcomeAccordion, null),
					React.createElement(core_1.CardMedia, null),
				),
			),
			React.createElement(
				core_1.Button,
				{
					variant: 'contained',
					color: 'primary',
					startIcon: React.createElement(Public_1['default'], null),
					onClick: handleChange,
				},
				'Get connected',
			),
		),
	);
};
