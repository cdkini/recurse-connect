'use strict';
exports.__esModule = true;
exports.Network = void 0;
var React = require('react');
var NavigationBar_1 = require('../../components/NavigationBar/NavigationBar');
var NetworkGraph_1 = require('../../components/NetworkGraph/NetworkGraph');
var FuzzySearchBar_1 = require('../../components/FuzzySearchBar/FuzzySearchBar');
var NetworkContext_1 = require('../../contexts/NetworkContext/NetworkContext');
exports.Network = function(props) {
	var _a = React.useState({
			nodes: [],
			links: [],
		}),
		graphData = _a[0],
		setGraphData = _a[1];
	React.useEffect(function() {
		fetch('/api/v1/graph/' + props.profileId.toString())
			.then(function(res) {
				return res.json();
			})
			.then(function(data) {
				setGraphData(data);
			});
	}, []);
	var _b = React.useState({}),
		userNode = _b[0],
		setUserNode = _b[1];
	React.useEffect(function() {
		fetch('/api/v1/users/' + props.profileId.toString())
			.then(function(res) {
				return res.json();
			})
			.then(function(data) {
				setUserNode(data);
			});
	}, []);
	var useRef = React.useRef;
	var fgRef = useRef();
	var profileId = props.profileId;
	return React.createElement(
		NetworkContext_1.NetworkContext.Provider,
		{
			value: {
				profileId: profileId,
				fgRef: fgRef,
				graphData: graphData,
				setGraphData: setGraphData,
				userNode: userNode,
				setUserNode: setUserNode,
			},
		},
		React.createElement(NavigationBar_1.NavigationBar, null),
		React.createElement(NetworkGraph_1.NetworkGraph, null),
		React.createElement(FuzzySearchBar_1.FuzzySearchBar, null),
	);
};
