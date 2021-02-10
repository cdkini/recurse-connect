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
exports.NavigationBar = void 0;
var React = require('react');
var AppBar_1 = require('@material-ui/core/AppBar');
var Chat_1 = require('@material-ui/icons/Chat');
var ChevronLeft_1 = require('@material-ui/icons/ChevronLeft');
var ChevronRight_1 = require('@material-ui/icons/ChevronRight');
var CssBaseline_1 = require('@material-ui/core/CssBaseline');
var Drawer_1 = require('@material-ui/core/Drawer');
var Explore_1 = require('@material-ui/icons/Explore');
var Home_1 = require('@material-ui/icons/Home');
var IconButton_1 = require('@material-ui/core/IconButton');
var List_1 = require('@material-ui/core/List');
var ListItem_1 = require('@material-ui/core/ListItem');
var ListItemIcon_1 = require('@material-ui/core/ListItemIcon');
var ListItemText_1 = require('@material-ui/core/ListItemText');
var Menu_1 = require('@material-ui/icons/Menu');
var People_1 = require('@material-ui/icons/People');
var Person_1 = require('@material-ui/icons/Person');
var Settings_1 = require('@material-ui/icons/Settings');
var Toolbar_1 = require('@material-ui/core/Toolbar');
var Typography_1 = require('@material-ui/core/Typography');
var clsx_1 = require('clsx');
var react_router_dom_1 = require('react-router-dom');
var styles_1 = require('@material-ui/core/styles');
var drawerWidth = 240;
var useStyles = styles_1.makeStyles(function(theme) {
	return {
		root: {
			display: 'flex',
		},
		appBar: {
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			background: '#3dc06c',
		},
		appBarShift: {
			width: 'calc(100% - ' + drawerWidth + 'px)',
			marginLeft: drawerWidth,
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		hide: {
			display: 'none',
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
		},
		drawerPaper: {
			width: drawerWidth,
		},
		drawerHeader: __assign(
			__assign(
				{ display: 'flex', alignItems: 'center', padding: theme.spacing(0, 1) },
				theme.mixins.toolbar,
			),
			{ justifyContent: 'flex-end' },
		),
		content: {
			flexGrow: 1,
			padding: theme.spacing(3),
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			marginLeft: -drawerWidth,
		},
		contentShift: {
			transition: theme.transitions.create('margin', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
			marginLeft: 0,
		},
		bottomPush: {
			position: 'fixed',
			bottom: 0,
			textAlign: 'center',
			paddingBottom: 10,
		},
	};
});
exports.NavigationBar = function() {
	var _a;
	var classes = useStyles();
	var theme = styles_1.useTheme();
	var _b = React.useState(false),
		open = _b[0],
		setOpen = _b[1];
	var handleDrawerOpen = function() {
		setOpen(true);
	};
	var handleDrawerClose = function() {
		setOpen(false);
	};
	return React.createElement(
		'div',
		{ className: classes.root },
		React.createElement(CssBaseline_1['default'], null),
		React.createElement(
			AppBar_1['default'],
			{
				position: 'fixed',
				className: clsx_1['default'](
					classes.appBar,
					((_a = {}), (_a[classes.appBarShift] = open), _a),
				),
			},
			React.createElement(
				Toolbar_1['default'],
				null,
				React.createElement(
					IconButton_1['default'],
					{
						color: 'inherit',
						'aria-label': 'open drawer',
						onClick: handleDrawerOpen,
						edge: 'start',
						className: clsx_1['default'](
							classes.menuButton,
							open && classes.hide,
						),
					},
					React.createElement(Menu_1['default'], null),
				),
				React.createElement(
					Typography_1['default'],
					{ variant: 'h6', noWrap: true },
					'Recurse Connect',
				),
			),
		),
		React.createElement(
			Drawer_1['default'],
			{
				className: classes.drawer,
				variant: 'persistent',
				anchor: 'left',
				open: open,
				classes: {
					paper: classes.drawerPaper,
				},
			},
			React.createElement(
				'div',
				{ className: classes.drawerHeader },
				React.createElement(
					IconButton_1['default'],
					{ onClick: handleDrawerClose },
					theme.direction === 'ltr'
						? React.createElement(ChevronLeft_1['default'], null)
						: React.createElement(ChevronRight_1['default'], null),
				),
			),
			React.createElement(
				List_1['default'],
				null,
				['Home', 'Feed', 'Network', 'Discover'].map(function(text, index) {
					return React.createElement(
						ListItem_1['default'],
						{
							button: true,
							key: text,
							component: react_router_dom_1.Link,
							to: text.toLowerCase(),
						},
						React.createElement(
							ListItemIcon_1['default'],
							null,
							[
								React.createElement(Home_1['default'], null),
								React.createElement(Chat_1['default'], null),
								React.createElement(People_1['default'], null),
								React.createElement(Explore_1['default'], null),
							][index],
						),
						React.createElement(ListItemText_1['default'], { primary: text }),
					);
				}),
			),
			React.createElement(
				'div',
				{ className: classes.bottomPush },
				React.createElement(
					List_1['default'],
					null,
					['Login', 'Settings'].map(function(text, index) {
						return React.createElement(
							ListItem_1['default'],
							{
								button: true,
								key: text,
								component: react_router_dom_1.Link,
								to: text.toLowerCase(),
							},
							React.createElement(
								ListItemIcon_1['default'],
								null,
								[
									React.createElement(Person_1['default'], null),
									React.createElement(Settings_1['default'], null),
								][index],
							),
							React.createElement(ListItemText_1['default'], { primary: text }),
						);
					}),
				),
			),
		),
	);
};
