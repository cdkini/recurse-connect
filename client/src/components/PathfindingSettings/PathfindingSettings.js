'use strict';
exports.__esModule = true;
exports.PathfindingSettings = void 0;
var React = require('react');
var Settings_1 = require('@material-ui/icons/Settings');
var core_1 = require('@material-ui/core');
var core_2 = require('@material-ui/core');
exports.PathfindingSettings = function() {
	// const {pathfinder} = React.useContext(FuzzySearchContext);
	var _a = React.useState(false),
		openDialog = _a[0],
		setOpenDialog = _a[1];
	var _b = React.useState(30),
		age = _b[0],
		setAge = _b[1];
	var _c = React.useState(false),
		openSelect = _c[0],
		setOpenSelect = _c[1];
	var _d = React.useState(true),
		animationSwitchChecked = _d[0],
		setAnimationSwitchChecked = _d[1];
	var _e = React.useState(false),
		nodeColorSwitchChecked = _e[0],
		setNodeColorSwitchChecked = _e[1];
	var _f = React.useState(100),
		animationSpeed = _f[0],
		setAnimationSpeed = _f[1];
	var handleDialogOpen = function() {
		setOpenDialog(true);
	};
	var handleDialogClose = function() {
		setOpenDialog(false);
	};
	var handleSelectChange = function(event) {
		setAge(event.target.value);
	};
	var handleSelectClose = function() {
		setOpenSelect(false);
	};
	var handleSelectOpen = function() {
		setOpenSelect(true);
	};
	var handleAnimationsSwitchClick = function() {
		setAnimationSwitchChecked(!animationSwitchChecked);
	};
	var handleNodeColorSwitchClick = function() {
		setNodeColorSwitchChecked(!nodeColorSwitchChecked);
	};
	var handleSliderChange = function(_event, newValue) {
		setAnimationSpeed(newValue);
	};
	return React.createElement(
		'div',
		null,
		React.createElement(
			core_2.IconButton,
			{ onClick: handleDialogOpen },
			React.createElement(Settings_1['default'], {
				fontSize: 'large',
				style: { color: '#000000' },
			}),
		),
		React.createElement(
			core_1.Dialog,
			{
				open: openDialog,
				onClose: handleDialogClose,
				fullWidth: true,
				maxWidth: 'sm',
			},
			React.createElement(
				core_1.DialogTitle,
				{ id: 'form-dialog-title' },
				'Pathfinding Settings',
			),
			React.createElement(core_1.Divider, null),
			React.createElement(
				core_1.DialogContent,
				null,
				React.createElement(
					core_1.List,
					{ component: 'nav', 'aria-label': 'mailbox folders' },
					React.createElement(
						core_1.ListItem,
						{ divider: true },
						React.createElement(core_1.ListItemText, {
							primary: 'Enable animations',
							secondary:
								'Toggle node/edge highlighting and dynamic camera movement',
						}),
						React.createElement(core_1.Switch, {
							checked: animationSwitchChecked,
							onClick: handleAnimationsSwitchClick,
						}),
					),
					React.createElement(
						core_1.ListItem,
						{ divider: true },
						React.createElement(core_1.ListItemText, {
							primary: 'Enable status bar',
							secondary:
								'Toggle updates about pathfinding state (marks, visits, etc)',
						}),
						React.createElement(core_1.Switch, {
							checked: animationSwitchChecked,
							onClick: handleAnimationsSwitchClick,
						}),
					),
					React.createElement(
						core_1.ListItem,
						{ divider: true },
						React.createElement(core_1.ListItemText, {
							primary: 'Enable color grouping',
							secondary:
								'Toggle between unique or shared color between batchmates',
						}),
						React.createElement(core_1.Switch, {
							checked: nodeColorSwitchChecked,
							onClick: handleNodeColorSwitchClick,
						}),
					),
					React.createElement(
						core_1.ListItem,
						{ divider: true },
						React.createElement(core_1.ListItemText, {
							primary: 'Pathfinder',
							secondary: 'Determines algorithm and treatment of graph edges',
						}),
						React.createElement(
							core_1.Select,
							{
								open: openSelect,
								onClose: handleSelectClose,
								onOpen: handleSelectOpen,
								value: age,
								onChange: handleSelectChange,
							},
							React.createElement(
								core_1.MenuItem,
								{ value: 10 },
								'DFS (unweighted)',
							),
							React.createElement(
								core_1.MenuItem,
								{ value: 20 },
								'BFS (unweighted)',
							),
							React.createElement(
								core_1.MenuItem,
								{ value: 30 },
								"Djikstra's (weighted)",
							),
							React.createElement(
								core_1.MenuItem,
								{ value: 40 },
								'A* Search (weighted)',
							),
						),
					),
					React.createElement(
						core_1.ListItem,
						{ divider: true },
						React.createElement(core_1.ListItemText, {
							primary: 'Animation speed',
							secondary: 'Determine delay between pathfinding states',
						}),
						React.createElement(core_1.Slider, {
							'aria-labelledby': 'discrete-slider',
							valueLabelDisplay: 'auto',
							onChange: handleSliderChange,
							step: 25,
							min: 0,
							max: 250,
							value: animationSpeed,
						}),
					),
				),
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
					{ onClick: handleDialogClose, color: 'primary' },
					'Save',
				),
			),
		),
	);
};
