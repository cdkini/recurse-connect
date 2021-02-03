'use strict';
exports.__esModule = true;
exports.Network = void 0;
var React = require('react');
var NavigationBar_1 = require('./NavigationBar');
var react_force_graph_2d_1 = require('react-force-graph-2d');
var Network = function() {
	var fgRef = React.useRef();
	var _a = React.useState({ nodes: [], links: [] }),
		graphData = _a[0],
		setGraphData = _a[1];
	React.useEffect(function() {
		fetch('/api/graph/498')
			.then(function(res) {
				return res.json();
			})
			.then(function(data) {
				setGraphData(data);
			});
	}, []);
	return React.createElement(
		'div',
		null,
		React.createElement(NavigationBar_1.NavigationBar, null),
		React.createElement('div', null, 'Network'),
		React.createElement(react_force_graph_2d_1['default'], {
			ref: fgRef,
			graphData: graphData,
			cooldownTicks: 100,
		}),
		';',
	);
};
exports.Network = Network;
