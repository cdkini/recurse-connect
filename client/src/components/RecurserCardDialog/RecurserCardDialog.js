'use strict';
exports.__esModule = true;
exports.RecurserCardDialog = void 0;
var React = require('react');
var core_1 = require('@material-ui/core');
var RecurserCard_1 = require('../RecurserCard/RecurserCard');
var NetworkGraphContext_1 = require('../../contexts/NetworkGraphContext/NetworkGraphContext');
exports.RecurserCardDialog = function() {
	var _a = React.useContext(NetworkGraphContext_1.NetworkGraphContext),
		focusedNode = _a.focusedNode,
		openDialog = _a.openDialog,
		handleDialogClose = _a.handleDialogClose;
	return React.createElement(
		core_1.Dialog,
		{ onClose: handleDialogClose, open: openDialog },
		React.createElement(RecurserCard_1.RecurserCard, { node: focusedNode }),
	);
};
