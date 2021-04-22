'use strict';
exports.__esModule = true;
exports.NotesSidebar = void 0;
var React = require('react');
// import { RecurserNote } from '../../types/RecurserNote';
var core_1 = require('@material-ui/core');
var List_1 = require('@material-ui/core/List');
var useStyles = core_1.makeStyles(function(theme) {
	return core_1.createStyles({
		root: {
			backgroundColor: theme.palette.background.paper,
			height: 'calc(100%)',
			position: 'absolute',
			left: '0',
			width: '20%',
			boxShadow: '0px 0px 2px black',
		},
		newChatBtn: {
			borderRadius: '0px',
		},
		unreadMessage: {
			color: 'red',
			position: 'absolute',
			top: '0',
			right: '5px',
		},
		newNoteBtn: {
			width: '100%',
			height: '35px',
			borderBottom: '1px solid black',
			borderRadius: '0px',
			backgroundColor: '#29487d',
			color: 'white',
			'&:hover': {
				backgroundColor: '#88a2ce',
			},
		},
		sidebarContainer: {
			marginTop: '0px',
			width: '300px',
			height: '100%',
			boxSizing: 'border-box',
			float: 'left',
			overflowY: 'scroll',
			overflowX: 'hidden',
		},
		newNoteInput: {
			width: '100%',
			margin: '0px',
			height: '35px',
			outline: 'none',
			border: 'none',
			paddingLeft: '5px',
			'&:focus': {
				outline: '2px solid rgba(81, 203, 238, 1)',
			},
		},
		newNoteSubmitBtn: {
			width: '100%',
			backgroundColor: '#28787c',
			borderRadius: '0px',
			color: 'white',
		},
	});
});
exports.NotesSidebar = function(props) {
	var classes = useStyles();
	function getImagePath(note) {
		if (note.participants) {
			var id =
				note.participants[Math.floor(Math.random() * note.participants.length)];
			for (var _i = 0, _a = props.profiles; _i < _a.length; _i++) {
				var profile = _a[_i];
				if (profile.id === id) {
					return profile.imagePath;
				}
			}
		}
		return 'https://d29xw0ra2h4o4u.cloudfront.net/assets/logo_square-051508b5ecf8868635aea567bb86f423f4d1786776e5dfce4adf2bc7edf05804.png';
	}
	var handleNoteClick = function(note) {
		console.log(note);
		props.setFocusedNote(note);
		console.log(props.focusedNote);
	};
	return React.createElement(
		List_1['default'],
		{ dense: true, className: classes.root },
		props.notes.map(function(note) {
			var labelId = 'checkbox-list-secondary-label-' + note;
			return React.createElement(
				'div',
				null,
				React.createElement(
					core_1.ListItem,
					{
						key: note.id,
						onClick: function() {
							return handleNoteClick(note);
						},
						button: true,
					},
					React.createElement(
						core_1.ListItemAvatar,
						null,
						React.createElement(core_1.Avatar, {
							alt: 'R',
							src: getImagePath(note),
						}),
					),
					React.createElement(core_1.ListItemText, {
						id: labelId,
						primary: '' + note.title,
						secondary: note.date.toLocaleString().substring(0, 16),
					}),
					React.createElement(
						core_1.Typography,
						{ variant: 'caption' },
						React.createElement('i', null, note.tags),
					),
				),
				React.createElement(core_1.Divider, { component: 'li' }),
			);
		}),
	);
};
