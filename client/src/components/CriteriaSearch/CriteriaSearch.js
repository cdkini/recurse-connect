'use strict';
exports.__esModule = true;
exports.CriteriaSearch = void 0;
var React = require('react');
var Checkbox_1 = require('@material-ui/core/Checkbox');
var FormControl_1 = require('@material-ui/core/FormControl');
var IconButton_1 = require('@material-ui/core/IconButton');
var Input_1 = require('@material-ui/core/Input');
var InputLabel_1 = require('@material-ui/core/InputLabel');
var ListItemText_1 = require('@material-ui/core/ListItemText');
var MenuItem_1 = require('@material-ui/core/MenuItem');
var Select_1 = require('@material-ui/core/Select');
var styles_1 = require('@material-ui/core/styles');
var core_1 = require('@material-ui/core');
var FuzzySearchContext_1 = require('../../contexts/FuzzySearchContext/FuzzySearchContext');
var NetworkContext_1 = require('../../contexts/NetworkContext/NetworkContext');
var fuse_js_1 = require('fuse.js');
var useStyles = styles_1.makeStyles(function(theme) {
	return styles_1.createStyles({
		root: {
			display: 'flex',
		},
		appBar: {
			background: '#3dc06c',
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
			maxWidth: 300,
		},
		extendedIcon: {
			marginRight: theme.spacing(1),
		},
		alert: {},
	});
});
var ITEM_HEIGHT = 48;
var ITEM_PADDING_TOP = 8;
var MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};
var criteria = [
	'tag',
	'location',
	'company',
	'interests',
	'batchName',
	'bio',
	'beforeRc',
	'duringRc',
];
exports.CriteriaSearch = function() {
	var classes = useStyles();
	var graphData = React.useContext(NetworkContext_1.NetworkContext).graphData;
	var _a = React.useContext(FuzzySearchContext_1.FuzzySearchContext),
		setSearchResults = _a.setSearchResults,
		setSelectedResults = _a.setSelectedResults,
		setOpenDialog = _a.setOpenDialog;
	var _b = React.useState(criteria),
		searchCriteria = _b[0],
		setSearchCriteria = _b[1];
	var _c = React.useState(''),
		searchQuery = _c[0],
		setSearchQuery = _c[1];
	var fuse = React.useMemo(
		function() {
			return new fuse_js_1['default'](graphData.nodes, {
				includeScore: true,
				keys: searchCriteria,
			});
		},
		[searchCriteria],
	);
	var handleDialogOpen = function(event) {
		if (event.keyCode === 13) {
			var results = fuse.search(searchQuery);
			setSearchResults(results);
			setSelectedResults(new Set(results));
			setOpenDialog(true);
		}
	};
	var handleCriteriaChange = function(event) {
		setSearchCriteria(event.target.value);
	};
	var handleQueryChange = function(event) {
		setSearchQuery(event.target.value);
	};
	return React.createElement(
		IconButton_1['default'],
		{
			edge: 'start',
			className: classes.menuButton,
			color: 'inherit',
			'aria-label': 'menu',
		},
		React.createElement(
			FormControl_1['default'],
			{ className: classes.formControl },
			React.createElement(
				InputLabel_1['default'],
				null,
				React.createElement('strong', null, 'Search by criteria'),
			),
			React.createElement(
				Select_1['default'],
				{
					multiple: true,
					value: searchCriteria,
					onChange: handleCriteriaChange,
					input: React.createElement(Input_1['default'], null),
					renderValue: function(selected) {
						return selected.join(', ');
					},
					MenuProps: MenuProps,
				},
				criteria.map(function(criterion) {
					return React.createElement(
						MenuItem_1['default'],
						{ key: criterion, value: criterion },
						React.createElement(Checkbox_1['default'], {
							checked: searchCriteria.indexOf(criterion) > -1,
						}),
						React.createElement(ListItemText_1['default'], {
							primary: criterion,
						}),
					);
				}),
			),
			React.createElement(
				core_1.FormHelperText,
				null,
				'What fields to search through',
			),
		),
		React.createElement(
			FormControl_1['default'],
			{ className: classes.formControl },
			React.createElement(core_1.TextField, {
				onChange: handleQueryChange,
				onKeyDown: handleDialogOpen,
				label: 'Query',
			}),
			React.createElement(
				core_1.FormHelperText,
				null,
				'Your search query ',
				React.createElement('i', null, '(Enter to submit)'),
			),
		),
	);
};
