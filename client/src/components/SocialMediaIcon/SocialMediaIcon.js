'use strict';
exports.__esModule = true;
exports.SocialMediaIcon = void 0;
var React = require('react');
var Popover_1 = require('@material-ui/core/Popover');
var Typography_1 = require('@material-ui/core/Typography');
var styles_1 = require('@material-ui/core/styles');
var core_1 = require('@material-ui/core');
var useStyles = styles_1.makeStyles(function(theme) {
	return styles_1.createStyles({
		popover: {
			pointerEvents: 'none',
		},
		paper: {
			padding: theme.spacing(1),
		},
	});
});
exports.SocialMediaIcon = function(props) {
	var classes = useStyles();
	var _a = React.useState(null),
		anchorEl = _a[0],
		setAnchorEl = _a[1];
	var handlePopoverOpen = function(event) {
		setAnchorEl(event.currentTarget);
	};
	var handlePopoverClose = function() {
		setAnchorEl(null);
	};
	var open = Boolean(anchorEl);
	return React.createElement(
		'div',
		{
			'aria-owns': open ? 'mouse-over-popover' : undefined,
			'aria-haspopup': 'true',
			onMouseEnter: handlePopoverOpen,
			onMouseLeave: handlePopoverClose,
		},
		React.createElement(
			core_1.IconButton,
			null,
			props.isClickable
				? React.cloneElement(props.icon, {
						onClick: props.handlePageChange(props.contents),
				  })
				: props.icon,
		),
		React.createElement(
			Popover_1['default'],
			{
				id: 'mouse-over-popover',
				className: classes.popover,
				classes: {
					paper: classes.paper,
				},
				open: open,
				anchorEl: anchorEl,
				anchorOrigin: {
					vertical: 'bottom',
					horizontal: 'left',
				},
				transformOrigin: {
					vertical: 'top',
					horizontal: 'left',
				},
				onClose: handlePopoverClose,
				disableRestoreFocus: true,
			},
			React.createElement(
				Typography_1['default'],
				null,
				props.isEmpty ? '404 Not Found :(' : props.contents,
			),
		),
	);
};
