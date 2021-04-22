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
exports.RecurserSearch = void 0;
var lab_1 = require('@material-ui/lab');
var NetworkContext_1 = require('../../contexts/NetworkContext/NetworkContext');
var React = require('react');
var core_1 = require('@material-ui/core');
var FuzzySearchContext_1 = require('../../contexts/FuzzySearchContext/FuzzySearchContext');
var styles_1 = require('@material-ui/core/styles');
var useStyles = styles_1.makeStyles(function(theme) {
	return styles_1.createStyles({
		formControl: {
			background: '#3dc06c',
			display: 'flex',
			flexGrow: 1,
			margin: theme.spacing(1),
			marginRight: theme.spacing(2),
			maxWidth: 300,
			minWidth: 120,
		},
	});
});
exports.RecurserSearch = function() {
	var classes = useStyles();
	var _a = React.useContext(NetworkContext_1.NetworkContext),
		userNode = _a.userNode,
		graphData = _a.graphData;
	var _b = React.useContext(FuzzySearchContext_1.FuzzySearchContext),
		recurserSearchValue = _b.recurserSearchValue,
		setRecurserSearchValue = _b.setRecurserSearchValue,
		recurserInputValue = _b.recurserInputValue,
		setRecurserInputValue = _b.setRecurserInputValue,
		pathfinder = _b.pathfinder,
		setOpenAlert = _b.setOpenAlert;
	var handleRecurserSearchSubmit = function(event) {
		if (event.keyCode === 13 && recurserSearchValue) {
			setOpenAlert(true);
			pathfinder.djikstras({
				sourceId: userNode.id,
				targetId: recurserSearchValue.id,
				animationDelay: 100,
			});
		}
	};
	return React.createElement(
		core_1.FormControl,
		{ className: classes.formControl },
		React.createElement(lab_1.Autocomplete, {
			value: recurserSearchValue,
			onChange: function(_event, newValue) {
				setRecurserSearchValue(newValue);
			},
			inputValue: recurserInputValue,
			onInputChange: function(_event, newInputValue) {
				setRecurserInputValue(newInputValue);
			},
			id: 'controllable-states-demo',
			options: graphData.nodes,
			getOptionLabel: function(option) {
				return option.name + ' (' + option.batchShortName + ')';
			},
			style: { width: 250 },
			renderInput: function(params) {
				return React.createElement(
					core_1.TextField,
					__assign(
						{
							label: React.createElement('strong', null, 'Search by Recurser'),
						},
						params,
					),
				);
			},
			onKeyDown: handleRecurserSearchSubmit,
		}),
		React.createElement(
			core_1.FormHelperText,
			null,
			'Your search query ',
			React.createElement('i', null, '(Enter to submit)'),
		),
	);
};
