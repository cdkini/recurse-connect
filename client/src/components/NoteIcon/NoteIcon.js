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
exports.NoteIcon = void 0;
var React = require('react');
var IconButton_1 = require('@material-ui/core/IconButton');
var core_1 = require('@material-ui/core');
var Create_1 = require('@material-ui/icons/Create');
var lab_1 = require('@material-ui/lab');
var NetworkContext_1 = require('../../contexts/NetworkContext/NetworkContext');
var pickers_1 = require('@material-ui/pickers');
var date_fns_1 = require('@date-io/date-fns');
exports.NoteIcon = function(props) {
	var _a = React.useContext(NetworkContext_1.NetworkContext),
		profileId = _a.profileId,
		graphData = _a.graphData;
	var _b = React.useState(false),
		openDialog = _b[0],
		setOpenDialog = _b[1];
	var _c = React.useState(''),
		title = _c[0],
		setTitle = _c[1];
	var _d = React.useState(new Date()),
		selectedDate = _d[0],
		setSelectedDate = _d[1];
	var _e = React.useState([props.currNode]),
		recursers = _e[0],
		setRecursers = _e[1];
	var _f = React.useState(''),
		tags = _f[0],
		setTags = _f[1];
	var _g = React.useState(''),
		content = _g[0],
		setContent = _g[1];
	var handleDialogOpen = function() {
		setOpenDialog(true);
	};
	var handleDialogClose = function() {
		setOpenDialog(false);
	};
	var handleTitleChange = function(event) {
		setTitle(event.target.value);
	};
	var handleDateChange = function(date) {
		setSelectedDate(date);
	};
	var handleTagsChange = function(event) {
		setTags(event.target.value);
	};
	var handleContentChange = function(event) {
		setContent(event.target.value);
	};
	var handleSubmitClick = function() {
		var body = {
			author: profileId,
			title: title,
			date: selectedDate,
			participants: recursers.map(function(r) {
				return r.id;
			}),
			tags: tags.split(', ').map(function(t) {
				return t.trim();
			}),
			content: content,
		};
		fetch('http://localhost:5000/api/v1/notes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'no-cors',
			body: JSON.stringify(body),
		});
		setOpenDialog(false);
	};
	return React.createElement(
		'div',
		null,
		React.createElement(
			IconButton_1['default'],
			{ onClick: handleDialogOpen },
			React.createElement(Create_1['default'], null),
		),
		React.createElement(
			core_1.Dialog,
			{
				open: openDialog,
				onClose: handleDialogClose,
				'aria-labelledby': 'form-dialog-title',
				fullWidth: true,
				maxWidth: 'md',
			},
			React.createElement(
				core_1.DialogTitle,
				{ id: 'form-dialog-title' },
				'Add note',
			),
			React.createElement(
				core_1.DialogContent,
				null,
				React.createElement(core_1.TextField, {
					autoFocus: true,
					margin: 'dense',
					label: 'Title',
					value: title,
					fullWidth: true,
					onChange: handleTitleChange,
				}),
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
				React.createElement(lab_1.Autocomplete, {
					multiple: true,
					options: graphData.nodes,
					onChange: function(_event, newValue) {
						setRecursers(newValue);
					},
					getOptionLabel: function(option) {
						return option.name + ' (' + option.batchShortName + ')';
					},
					value: recursers,
					renderInput: function(params) {
						return React.createElement(
							core_1.TextField,
							__assign({}, params, { variant: 'standard', label: 'Recursers' }),
						);
					},
				}),
				React.createElement(core_1.TextField, {
					margin: 'dense',
					label: 'Tags',
					value: tags,
					onChange: handleTagsChange,
					fullWidth: true,
					multiline: true,
				}),
				React.createElement(core_1.TextField, {
					margin: 'dense',
					label: 'Content',
					value: content,
					onChange: handleContentChange,
					fullWidth: true,
					multiline: true,
				}),
			),
			React.createElement(
				core_1.DialogActions,
				null,
				React.createElement(
					core_1.Button,
					{ onClick: handleDialogClose, color: 'primary' },
					'Cancel',
				),
				React.createElement(
					core_1.Button,
					{ onClick: handleSubmitClick, color: 'primary' },
					'Submit',
				),
			),
		),
	);
};
