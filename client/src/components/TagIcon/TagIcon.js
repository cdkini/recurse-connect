'use strict';
exports.__esModule = true;
exports.TagIcon = void 0;
var React = require('react');
var IconButton_1 = require('@material-ui/core/IconButton');
var Label_1 = require('@material-ui/icons/Label');
var core_1 = require('@material-ui/core');
var NetworkContext_1 = require('../../contexts/NetworkContext/NetworkContext');
exports.TagIcon = function(props) {
	var profileId = React.useContext(NetworkContext_1.NetworkContext).profileId;
	var _a = React.useState(false),
		open = _a[0],
		setOpen = _a[1];
	var _b = React.useState(''),
		tags = _b[0],
		setTags = _b[1];
	var handleClickOpen = function() {
		setOpen(true);
	};
	var handleClose = function() {
		setOpen(false);
	};
	var handleTagsChange = function(event) {
		setTags(event.target.value);
	};
	var handleSubmitClick = function() {
		var items = [];
		var arr = tags.split(', ').map(function(t) {
			return t.trim();
		});
		for (var i = 0; i < arr.length; i++) {
			items.push({
				author: profileId,
				participant: props.currNode.id,
				name: arr[i],
			});
		}
		var body = {
			tags: items,
		};
		fetch('/api/v1/tags', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// mode: 'no-cors',
			body: JSON.stringify(body),
		});
		setOpen(false);
	};
	return React.createElement(
		'div',
		null,
		React.createElement(
			IconButton_1['default'],
			{ onClick: handleClickOpen },
			React.createElement(Label_1['default'], null),
		),
		React.createElement(
			core_1.Dialog,
			{
				open: open,
				onClose: handleClose,
				'aria-labelledby': 'form-dialog-title',
			},
			React.createElement(
				core_1.DialogTitle,
				{ id: 'form-dialog-title' },
				'Add tags',
			),
			React.createElement(
				core_1.DialogContent,
				null,
				React.createElement(
					core_1.DialogContentText,
					null,
					"Recurse Connect uses a system of tags to improve search results over time. If you've interacted with this participant, feel free to add some! Tags can be about interests, hobbies, events, reading groups, and more!",
				),
				React.createElement(core_1.TextField, {
					autoFocus: true,
					margin: 'dense',
					id: 'name',
					label:
						'Please write Recurser tags below (separate by commas if multiple)',
					type: 'email',
					fullWidth: true,
					onChange: handleTagsChange,
				}),
			),
			React.createElement(
				core_1.DialogActions,
				null,
				React.createElement(
					core_1.Button,
					{ onClick: handleClose, color: 'primary' },
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
