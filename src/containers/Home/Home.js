'use strict';
exports.__esModule = true;
exports.Home = void 0;
var React = require('react');
var NavigationBar_1 = require('../../components/NavigationBar/NavigationBar');
exports.Home = function() {
	return React.createElement(
		'div',
		null,
		React.createElement(NavigationBar_1.NavigationBar, null),
		React.createElement('div', null, 'Home'),
	);
};
