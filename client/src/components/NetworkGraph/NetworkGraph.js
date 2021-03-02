'use strict';
exports.__esModule = true;
exports.NetworkGraph = void 0;
var React = require('react');
var react_force_graph_2d_1 = require('react-force-graph-2d');
var NetworkContext_1 = require('../../contexts/NetworkContext/NetworkContext');
var NetworkGraphContext_1 = require('../../contexts/NetworkGraphContext/NetworkGraphContext');
var RecurserCardDialog_1 = require('../RecurserCardDialog/RecurserCardDialog');
exports.NetworkGraph = function() {
	var _a = React.useState(false),
		openDialog = _a[0],
		setOpenDialog = _a[1];
	var _b = React.useContext(NetworkContext_1.NetworkContext),
		fgRef = _b.fgRef,
		graphData = _b.graphData,
		userNode = _b.userNode;
	var _c = React.useState(userNode),
		focusedNode = _c[0],
		setFocusedNode = _c[1];
	var handleDialogOpen = function() {
		setOpenDialog(true);
	};
	var handleDialogClose = function() {
		setOpenDialog(false);
	};
	var handleNodeClick = function(node) {
		fgRef.current.zoom(8, 2000);
		fgRef.current.centerAt(node.x, node.y, 1000);
	};
	var handleNodeRightClick = function(node) {
		setFocusedNode(node);
		handleDialogOpen();
	};
	var handleBackgroundClick = function() {
		fgRef.current.zoom(3, 2000);
		fgRef.current.centerAt(0, 0, 1000);
	};
	var handleBackgroundRightClick = function() {
		fgRef.current.zoom(1, 2000);
		fgRef.current.centerAt(0, 0, 1000);
	};
	return React.createElement(
		NetworkGraphContext_1.NetworkGraphContext.Provider,
		{
			value: {
				focusedNode: focusedNode,
				openDialog: openDialog,
				handleDialogOpen: handleDialogOpen,
				handleDialogClose: handleDialogClose,
			},
		},
		React.createElement(RecurserCardDialog_1.RecurserCardDialog, null),
		React.createElement(react_force_graph_2d_1['default'], {
			ref: fgRef,
			graphData: graphData,
			nodeLabel: 'name',
			nodeAutoColorBy: 'name',
			nodeVal: function(node) {
				return typeof node.id == 'string' ? 2 : 1;
			},
			onNodeClick: handleNodeClick,
			onNodeRightClick: handleNodeRightClick,
			onBackgroundClick: handleBackgroundClick,
			onBackgroundRightClick: handleBackgroundRightClick,
			linkDirectionalParticles: 1.4,
			linkDirectionalParticleWidth: 2,
		}),
	);
};
