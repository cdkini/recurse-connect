'use strict';
exports.__esModule = true;
var React = require('react');
var styles_1 = require('@material-ui/core/styles');
var Card_1 = require('@material-ui/core/Card');
var CardActions_1 = require('@material-ui/core/CardActions');
var CardContent_1 = require('@material-ui/core/CardContent');
var Button_1 = require('@material-ui/core/Button');
var Typography_1 = require('@material-ui/core/Typography');
var useStyles = styles_1.makeStyles({
	root: {
		minWidth: 275,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});
function SimpleCard() {
	var classes = useStyles();
	var bull = React.createElement(
		'span',
		{ className: classes.bullet },
		'\u2022',
	);
	return React.createElement(
		Card_1['default'],
		{ className: classes.root },
		React.createElement(
			CardContent_1['default'],
			null,
			React.createElement(
				Typography_1['default'],
				{
					className: classes.title,
					color: 'textSecondary',
					gutterBottom: true,
				},
				'Word of the Day',
			),
			React.createElement(
				Typography_1['default'],
				{ variant: 'h5', component: 'h2' },
				'be',
				bull,
				'nev',
				bull,
				'o',
				bull,
				'lent',
			),
			React.createElement(
				Typography_1['default'],
				{ className: classes.pos, color: 'textSecondary' },
				'adjective',
			),
			React.createElement(
				Typography_1['default'],
				{ variant: 'body2', component: 'p' },
				'well meaning and kindly.',
				React.createElement('br', null),
				'"a benevolent smile"',
			),
		),
		React.createElement(
			CardActions_1['default'],
			null,
			React.createElement(Button_1['default'], { size: 'small' }, 'Learn More'),
		),
	);
}
exports['default'] = SimpleCard;
