'use strict';
exports.__esModule = true;
exports.FuzzySearchResults = void 0;
var React = require('react');
var FormControl_1 = require('@material-ui/core/FormControl');
var core_1 = require('@material-ui/core');
var NetworkContext_1 = require('../../contexts/NetworkContext/NetworkContext');
var FuzzySearchContext_1 = require('../../contexts/FuzzySearchContext/FuzzySearchContext');
var useStyles = core_1.makeStyles(function(theme) {
	return core_1.createStyles({
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
			maxWidth: 300,
		},
		dialog: {
			margin: 0,
			padding: theme.spacing(2),
		},
		avatar: {
			width: theme.spacing(7),
			height: theme.spacing(7),
		},
	});
});
exports.FuzzySearchResults = function() {
	var classes = useStyles();
	var _a = React.useContext(NetworkContext_1.NetworkContext),
		graphData = _a.graphData,
		setGraphData = _a.setGraphData;
	var _b = React.useContext(FuzzySearchContext_1.FuzzySearchContext),
		openDialog = _b.openDialog,
		setOpenDialog = _b.setOpenDialog,
		searchResults = _b.searchResults,
		setSearchResults = _b.setSearchResults,
		selectedResults = _b.selectedResults,
		setSelectedResults = _b.setSelectedResults;
	var _c = React.useState(0),
		threshold = _c[0],
		setThreshold = _c[1];
	var _d = React.useState(0),
		resultCap = _d[0],
		setResultCap = _d[1];
	var handleDialogClose = function() {
		setSearchResults([]);
		setSelectedResults(new Set());
		setThreshold(0);
		setResultCap(0);
		setOpenDialog(false);
	};
	var handlePageChange = function(url) {
		return function() {
			if (typeof url === 'string') {
				window.open('http://' + url, '_blank');
			}
		};
	};
	var handleSwitchState = function(result) {
		return selectedResults.has(result);
	};
	var handleSwitchToggle = function(result) {
		return function() {
			var newResultNodes = new Set(selectedResults);
			if (selectedResults.has(result)) {
				newResultNodes['delete'](result);
			} else {
				newResultNodes.add(result);
			}
			setSelectedResults(newResultNodes);
		};
	};
	var handleVisualizeButtonClick = function() {
		var selectedNodes = new Set();
		selectedResults.forEach(function(res) {
			return selectedNodes.add(res.item);
		});
		for (var i = 0; i < graphData.nodes.length; i++) {
			var currNode = graphData.nodes[i];
			if (selectedNodes.has(currNode)) {
				graphData.nodes[i].color = '#3dc06c';
			} else {
				graphData.nodes[i].color = '#000000';
			}
		}
		setGraphData(graphData);
		setOpenDialog(false);
	};
	var handleThresholdChange = function(event) {
		var conversion = parseInt(event.target.value);
		if (!conversion || !(conversion >= 0 && conversion <= 100)) {
			return; // TODO: Change up the error message and disable!
		}
		setThreshold(conversion);
	};
	var handleThresholdSubmit = function(event) {
		if (event.keyCode === 13) {
			var newSelectedResults = new Set();
			for (var i = 0; i < searchResults.length; i++) {
				var resultScore = searchResults[i].score;
				if (resultScore && Math.floor(100 * (1 - resultScore)) < threshold) {
					break;
				}
				newSelectedResults.add(searchResults[i]);
			}
			setSelectedResults(newSelectedResults);
		}
	};
	var handleResultCapChange = function(event) {
		var conversion = parseInt(event.target.value);
		if (
			!conversion ||
			!(conversion >= 0 && conversion <= searchResults.length)
		) {
			return; // TODO: Change up the error message and disable!
		}
		setResultCap(conversion);
	};
	var handleResultCapSubmit = function(event) {
		if (event.keyCode === 13) {
			var newSelectedResults = new Set();
			for (var i = 0; i < resultCap; i++) {
				newSelectedResults.add(searchResults[i]);
			}
			setSelectedResults(newSelectedResults);
		}
	};
	var listSearchResults = function() {
		var stringifyScore = function(score) {
			var val = Math.floor(100 * (1 - score));
			return React.createElement('i', null, ' ', val, '% similarity');
		};
		return searchResults.map(function(res) {
			return React.createElement(
				core_1.ListItem,
				{ divider: true, key: res.item.id },
				React.createElement(core_1.Switch, {
					checked: handleSwitchState(res),
					onClick: handleSwitchToggle(res),
				}),
				React.createElement(core_1.Avatar, {
					className: classes.avatar,
					src: res.item.imagePath,
					onClick: handlePageChange(res.item.profilePath),
				}),
				React.createElement(
					core_1.Typography,
					null,
					res.item.name,
					' (',
					res.item.batchShortName,
					') |',
					' ',
					res.score ? stringifyScore(res.score) : null,
				),
			);
		});
	};
	return React.createElement(
		core_1.Dialog,
		{
			className: classes.dialog,
			onClose: handleDialogClose,
			open: openDialog,
			fullWidth: true,
			maxWidth: 'sm',
		},
		React.createElement(
			core_1.DialogTitle,
			{ id: 'customized-dialog-title' },
			'Search Results',
		),
		React.createElement(
			core_1.DialogContent,
			null,
			React.createElement(
				'div',
				null,
				"You've currently selected ",
				React.createElement('b', null, selectedResults.size),
				' of',
				' ',
				React.createElement('b', null, searchResults.length),
				' possible results.',
				React.createElement('br', null),
				"If you'd like to change this, please filter or manually switch connections below.",
				React.createElement('br', null),
			),
			React.createElement(
				FormControl_1['default'],
				{ className: classes.formControl },
				React.createElement(core_1.TextField, {
					onChange: handleThresholdChange,
					onKeyDown: handleThresholdSubmit,
					label: 'Set similarity threshold ',
					defaultValue: 0,
				}),
				React.createElement(
					core_1.FormHelperText,
					null,
					React.createElement(
						'i',
						null,
						'Set minimum threshold (Enter to submit)',
					),
				),
			),
			React.createElement(
				FormControl_1['default'],
				{ className: classes.formControl },
				React.createElement(core_1.TextField, {
					onChange: handleResultCapChange,
					onKeyDown: handleResultCapSubmit,
					label: 'Set result cap',
					defaultValue: searchResults.length,
				}),
				React.createElement(
					core_1.FormHelperText,
					null,
					React.createElement(
						'i',
						null,
						'Set number of results (Enter to submit)',
					),
				),
			),
			React.createElement(
				core_1.List,
				null,
				searchResults.length > 0
					? listSearchResults()
					: 'No results found; please check your input criteria and query.',
			),
		),
		React.createElement(
			core_1.DialogActions,
			null,
			React.createElement(
				core_1.Button,
				{ onClick: handleVisualizeButtonClick },
				'Connect',
			),
		),
	);
};
