'use strict';
exports.__esModule = true;
exports.NetworkDialog = void 0;
var React = require('react');
var Dialog_1 = require('@material-ui/core/Dialog');
var RecurserCard_1 = require('../RecurserCard/RecurserCard');
exports.NetworkDialog = function(props) {
	var _a = React.useState(false),
		open = _a[0],
		setOpen = _a[1];
	var handleDialogOpen = function() {
		setOpen(true);
	};
	var handleDialogClose = function() {
		setOpen(false);
	};
	return React.createElement(
		'div',
		null,
		React.createElement(
			Dialog_1['default'],
			{ onClose: handleDialogClose, open: open },
			React.createElement(RecurserCard_1.RecurserCard, { node: props.node }),
		),
	);
};
