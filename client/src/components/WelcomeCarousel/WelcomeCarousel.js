'use strict';
exports.__esModule = true;
exports.WelcomeCarousel = void 0;
var React = require('react');
var material_auto_rotating_carousel_1 = require('material-auto-rotating-carousel');
var Button_1 = require('@material-ui/core/Button');
var colors_1 = require('@material-ui/core/colors');
var styles_1 = require('@material-ui/core/styles');
var react_router_dom_1 = require('react-router-dom');
var GitHub_1 = require('@material-ui/icons/GitHub');
var PlayArrow_1 = require('@material-ui/icons/PlayArrow');
var useStyles = styles_1.makeStyles(function(theme) {
	return styles_1.createStyles({
		root: {
			width: '100%',
			height: 500,
			justify: 'center',
			align: 'center',
			alignItems: 'center',
			textAlign: 'center',
		},
		button: {
			margin: theme.spacing(1),
			justify: 'center',
			align: 'center',
			alignItems: 'center',
			textAlign: 'center',
			background: 'black',
			textTransform: 'none',
			borderRadius: '20px',
		},
		carousel: {
			position: 'absolute',
		},
		illustration: {
			width: '75%',
			height: '75%',
		},
	});
});
exports.WelcomeCarousel = function(_a) {
	var classes = useStyles();
	var _b = React.useState({ open: false }),
		state = _b[0],
		setState = _b[1];
	var history = react_router_dom_1.useHistory();
	var redirectToLogin = function() {
		history.push('/login');
	};
	var redirectToGitHub = function() {
		window.open('https://github.com/cdkini/recurse-connect');
	};
	return React.createElement(
		'div',
		{ className: classes.root },
		React.createElement('br', null),
		React.createElement('br', null),
		React.createElement('br', null),
		React.createElement('br', null),
		React.createElement('br', null),
		React.createElement('h1', null, 'Recurse Connect'),
		React.createElement('h3', null, 'Using BFS to find you a new BFF'),
		React.createElement('br', null),
		React.createElement(
			Button_1['default'],
			{
				className: classes.button,
				variant: 'contained',
				color: 'primary',
				onClick: function() {
					return setState({ open: true });
				},
				startIcon: React.createElement(PlayArrow_1['default'], null),
			},
			'Get started',
		),
		React.createElement(
			Button_1['default'],
			{
				className: classes.button,
				variant: 'contained',
				color: 'primary',
				onClick: redirectToGitHub,
				startIcon: React.createElement(GitHub_1['default'], null),
			},
			'Contribute',
		),
		React.createElement(
			material_auto_rotating_carousel_1.AutoRotatingCarousel,
			{
				className: classes.carousel,
				label: 'Login',
				interval: 6000,
				open: state.open,
				onClose: function() {
					return setState({ open: false });
				},
				onStart: redirectToLogin,
			},
			React.createElement(material_auto_rotating_carousel_1.Slide, {
				media: React.createElement('img', {
					className: classes.illustration,
					src: process.env.PUBLIC_URL + '/assets/undraw-connection.svg',
					alt: 'undraw-connection',
				}),
				mediaBackgroundStyle: { backgroundColor: colors_1.green[400] },
				style: { backgroundColor: colors_1.green[600] },
				title: 'Welcome to Recurse Connect!',
				subtitle: 'Using BFS to find you a new BFF.',
			}),
			React.createElement(material_auto_rotating_carousel_1.Slide, {
				media: React.createElement('img', {
					className: classes.illustration,
					src: process.env.PUBLIC_URL + '/assets/undraw-messages.svg',
					alt: 'undraw-messages',
				}),
				mediaBackgroundStyle: { backgroundColor: colors_1.green[400] },
				style: { backgroundColor: colors_1.green[600] },
				title: 'Feed',
				subtitle: 'See what your fellow Recursers are up to!',
			}),
			React.createElement(material_auto_rotating_carousel_1.Slide, {
				media: React.createElement('img', {
					className: classes.illustration,
					src: process.env.PUBLIC_URL + '/assets/undraw-friends.svg',
					alt: 'undraw-friends',
				}),
				mediaBackgroundStyle: { backgroundColor: colors_1.green[400] },
				style: { backgroundColor: colors_1.green[600] },
				title: 'Network',
				subtitle:
					"Get to know the participants you've crossed paths with a bit better!",
			}),
			React.createElement(material_auto_rotating_carousel_1.Slide, {
				media: React.createElement('img', {
					className: classes.illustration,
					src: process.env.PUBLIC_URL + '/assets/undraw-happy.svg',
					alt: 'undraw-happy',
				}),
				mediaBackgroundStyle: { backgroundColor: colors_1.green[400] },
				style: { backgroundColor: colors_1.green[600] },
				title: 'Discover',
				subtitle:
					'Dive into 10 years of RC history, starting from the Hacker School days.',
			}),
			React.createElement(material_auto_rotating_carousel_1.Slide, {
				media: React.createElement('img', {
					className: classes.illustration,
					src: process.env.PUBLIC_URL + '/assets/undraw-thinking.svg',
					alt: 'undraw-thinking',
				}),
				mediaBackgroundStyle: { backgroundColor: colors_1.green[400] },
				style: { backgroundColor: colors_1.green[600] },
				title: 'Contribute',
				subtitle:
					'Have an idea to improve Recurse Connect? This site is built by and for the RC community so feel free to leave an issue or PR at our GitHub repo.',
			}),
		),
	);
};
