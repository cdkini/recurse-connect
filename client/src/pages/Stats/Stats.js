'use strict';
exports.__esModule = true;
exports.Stats = void 0;
var React = require('react');
// import Timeline from '@material-ui/lab/Timeline';
// import TimelineItem from '@material-ui/lab/TimelineItem';
// import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
// import TimelineConnector from '@material-ui/lab/TimelineConnector';
// import TimelineContent from '@material-ui/lab/TimelineContent';
// import TimelineDot from '@material-ui/lab/TimelineDot';
var NavigationBar_1 = require('../../components/NavigationBar/NavigationBar');
exports.Stats = function() {
	return React.createElement(
		'div',
		null,
		React.createElement(NavigationBar_1.NavigationBar, null),
		React.createElement('br', null),
		React.createElement('br', null),
		React.createElement('br', null),
		React.createElement('br', null),
		React.createElement('br', null),
		React.createElement('div', null, 'RC TIMELINE'),
		React.createElement(
			'div',
			null,
			'Time since Batch[0] (Summer 2011): Years, Months, Weeks, Days',
		),
		React.createElement('div', null, 'Number of unique participants: '),
		React.createElement('div', null, 'Number of returning participants: '),
		React.createElement('div', null, 'Number of countries people are from:'),
		React.createElement('div', null, 'Companies'),
		React.createElement('br', null),
		React.createElement(
			'div',
			null,
			'RECURSER TIMELINE: First day, last day, 1 year anniversary, 5 year anniversary, now',
		),
		React.createElement('div', null, "Time you've been a Recurser"),
		React.createElement('div', null, "Number of batches you've done"),
		React.createElement('div', null, "Days you've spent at RC"),
		React.createElement('div', null, "Number of people you've met"),
	);
};
