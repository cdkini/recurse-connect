'use strict';
var __assign =
	(this && this.__assign) ||
	function() {
		__assign =
			Object.assign ||
			function(t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
exports.__esModule = true;
exports.NotesEditor = void 0;
var React = require('react');
// import BorderColorIcon from '@material-ui/icons/BorderColor';
// import debounce from '../../utils/noteUtils';
// import { RecurserNote } from '../../types/RecurserNote';
var core_1 = require('@material-ui/core');
var MarkdownField_1 = require('../MarkdownField/MarkdownField');
var pickers_1 = require('@material-ui/pickers');
var date_fns_1 = require('@date-io/date-fns');
var Save_1 = require('@material-ui/icons/Save');
var Delete_1 = require('@material-ui/icons/Delete');
var core_2 = require('@material-ui/core');
var lab_1 = require('@material-ui/lab');
var useStyles = core_1.makeStyles(function(theme) {
	return core_1.createStyles({
		root: {
			backgroundColor: theme.palette.background.paper,
			height: 'calc(100% - 35px)',
			position: 'absolute',
			left: '0',
			width: '300px',
			boxShadow: '0px 0px 2px black',
		},
		titleInput: {
			height: '50px',
			boxSizing: 'border-box',
			border: 'none',
			padding: '5px',
			fontSize: '24px',
			width: 'calc(100% - 300px)',
			backgroundColor: '#29487d',
			color: 'white',
			paddingLeft: '50px',
		},
		editIcon: {
			position: 'absolute',
			left: '310px',
			top: '12px',
			color: 'white',
			width: '10',
			height: '10',
		},
		editorContainer: {
			// height: '100%',
			// boxSizing: 'border-box'
		},
		button: {
			margin: theme.spacing(1),
		},
	});
});
var initialContent = [
	{
		type: 'heading-two',
		children: [{ text: 'Start documenting your time at RC!' }],
	},
	{
		type: 'paragraph',
		children: [
			{
				text: 'The editor supports Markdown! Try starting a new line with:',
			},
			{
				text: '\n    - # for headers',
			},
			{
				text: '\n    - > for a block quote',
			},
			{
				text: '\n    - *, +, or - for lists',
			},
		],
	},
];
exports.NotesEditor = function(props) {
	var classes = useStyles();
	var _a = React.useState([]),
		participants = _a[0],
		setParticipants = _a[1];
	var _b = React.useState(props.focusedNote.title),
		title = _b[0],
		setTitle = _b[1];
	var _c = React.useState(props.focusedNote.date),
		selectedDate = _c[0],
		setSelectedDate = _c[1];
	var _d = React.useState(props.focusedNote.tags),
		tags = _d[0],
		setTags = _d[1];
	var _e = React.useState(initialContent),
		content = _e[0],
		setContent = _e[1];
	var handleTitleChange = function(event) {
		setTitle(event.target.value);
	};
	var handleDateChange = function(date) {
		setSelectedDate(date);
	};
	var handleTagsChange = function(event) {
		setTags(event.target.value);
	};
	var handleSaveClick = function() {
		var body = {
			author: props.profileId,
			title: title,
			date: selectedDate,
			participants: participants.map(function(r) {
				return r.id;
			}),
			tags: tags
				? tags.split(', ').map(function(t) {
						return t.trim();
				  })
				: null,
			content: content,
		};
		fetch('http://localhost:5000/api/v1/notes', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// mode: 'no-cors',
			body: JSON.stringify(body),
		});
	};
	var handleDeleteClick = function() {
		fetch(
			'http://localhost:5000/api/v1/notes/' +
				props.profileId.toString() +
				'/' +
				props.focusedNote.id,
			{
				method: 'DELETE',
			},
		);
	};
	return React.createElement(
		'div',
		{ style: { padding: 16, margin: 'auto', maxWidth: 1500 } },
		React.createElement(core_2.CssBaseline, null),
		React.createElement(
			core_2.Paper,
			{ style: { padding: 16 } },
			React.createElement(
				core_2.Grid,
				{ container: true, alignItems: 'flex-start', spacing: 2 },
				React.createElement(
					core_2.Grid,
					{ item: true, xs: 8 },
					React.createElement(core_1.TextField, {
						autoFocus: true,
						fullWidth: true,
						type: 'heading',
						label: 'Title',
						margin: 'dense',
						defaultValue: 'My new note!',
						onChange: handleTitleChange,
					}),
				),
				React.createElement(
					core_2.Grid,
					{ item: true, xs: 4 },
					React.createElement(
						pickers_1.MuiPickersUtilsProvider,
						{ utils: date_fns_1['default'] },
						React.createElement(pickers_1.KeyboardDatePicker, {
							disableToolbar: true,
							format: 'MM/dd/yyyy',
							margin: 'dense',
							label: 'Date',
							fullWidth: true,
							value: selectedDate,
							onChange: handleDateChange,
							KeyboardButtonProps: {
								'aria-label': 'change date',
							},
						}),
					),
				),
				React.createElement(
					core_2.Grid,
					{ item: true, xs: 12 },
					React.createElement(lab_1.Autocomplete, {
						multiple: true,
						options: Array.from(props.profiles.values()),
						onChange: function(_event, newValue) {
							setParticipants(newValue);
						},
						getOptionLabel: function(option) {
							return option.profilePath
								? option.name + ' (' + option.batchShortName + ')'
								: '' + option.name;
						},
						value: participants,
						renderInput: function(params) {
							return React.createElement(
								core_1.TextField,
								__assign({}, params, {
									variant: 'standard',
									label: 'Recursers',
								}),
							);
						},
					}),
				),
				React.createElement(
					core_2.Grid,
					{ item: true, xs: 12 },
					React.createElement(core_1.TextField, {
						fullWidth: true,
						multiline: true,
						label: 'Tags',
						onChange: handleTagsChange,
					}),
				),
				React.createElement(
					core_2.Grid,
					{ item: true, xs: 12 },
					React.createElement('br', null),
					React.createElement(MarkdownField_1.MarkdownField, {
						content: content,
						setContent: setContent,
					}),
				),
				React.createElement(
					core_2.Grid,
					{ container: true, xs: 12, justify: 'flex-end' },
					React.createElement(
						core_1.Button,
						{
							id: 'delete',
							name: 'deleteButton',
							variant: 'contained',
							color: 'primary',
							size: 'small',
							className: classes.button,
							startIcon: React.createElement(Delete_1['default'], null),
							style: {
								backgroundColor: '#e50000',
							},
							onClick: handleDeleteClick,
						},
						'Delete',
					),
					React.createElement(
						core_1.Button,
						{
							id: 'save',
							name: 'saveButton',
							variant: 'contained',
							color: 'primary',
							size: 'small',
							className: classes.button,
							startIcon: React.createElement(Save_1['default'], null),
							style: {
								backgroundColor: '#0080ff',
							},
							onClick: handleSaveClick,
						},
						'Save',
					),
				),
			),
		),
	);
};
