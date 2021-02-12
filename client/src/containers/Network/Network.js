'use strict';
exports.__esModule = true;
exports.Network = void 0;
var React = require('react');
var NavigationBar_1 = require('../../components/NavigationBar/NavigationBar');
var NetworkGraph_1 = require('../../components/NetworkGraph/NetworkGraph');
exports.Network = function(props) {
	return React.createElement(
		'div',
		null,
		React.createElement(NavigationBar_1.NavigationBar, null),
		React.createElement(NetworkGraph_1.NetworkGraph, {
			profileId: props.profileID,
		}),
	);
};
