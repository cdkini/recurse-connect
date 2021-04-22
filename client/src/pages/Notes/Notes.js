'use strict';
exports.__esModule = true;
exports.Notes = void 0;
var React = require('react');
require('./Notes.css');
var NotesSidebar_1 = require('../../components/NotesSidebar/NotesSidebar');
var NotesEditor_1 = require('../../components/NotesEditor/NotesEditor');
var NavigationBar_1 = require('../../components/NavigationBar/NavigationBar');
var core_1 = require('@material-ui/core');
var useStyles = core_1.makeStyles(function(theme) {
	return core_1.createStyles({
		content: {
			toolbar: theme.mixins.toolbar,
		},
		shiftTextRight: {
			marginLeft: 385,
		},
	});
});
exports.Notes = function(props) {
	var classes = useStyles();
	var _a = React.useState([]),
		profiles = _a[0],
		setProfiles = _a[1];
	React.useEffect(function() {
		fetch('/api/v1/graph/' + props.profileId.toString())
			.then(function(res) {
				return res.json();
			})
			.then(function(data) {
				setProfiles(data.nodes);
			});
	}, []);
	var _b = React.useState([]),
		notes = _b[0],
		setNotes = _b[1];
	React.useEffect(function() {
		fetch('/api/v1/notes/' + props.profileId.toString())
			.then(function(res) {
				return res.json();
			})
			.then(function(data) {
				setNotes(Object.values(data.notes));
			});
	}, []);
	var _c = React.useState(null),
		focusedNote = _c[0],
		setFocusedNote = _c[1];
	var profileId = props.profileId;
	return React.createElement(
		'div',
		null,
		React.createElement(NavigationBar_1.NavigationBar, null),
		React.createElement(
			'div',
			{ className: classes.content },
			React.createElement(core_1.Toolbar, null),
			React.createElement(NotesSidebar_1.NotesSidebar, {
				profileId: profileId,
				notes: notes,
				profiles: profiles,
				focusedNote: focusedNote,
				setFocusedNote: setFocusedNote,
			}),
			React.createElement(
				'div',
				{ className: classes.shiftTextRight },
				focusedNote
					? React.createElement(NotesEditor_1.NotesEditor, {
							profileId: profileId,
							profiles: profiles,
							focusedNote: focusedNote,
					  })
					: React.createElement('div', null),
			),
		),
	);
};
