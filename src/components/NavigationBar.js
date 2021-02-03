'use strict';
exports.__esModule = true;
exports.NavigationBar = void 0;
var React = require('react');
var react_bootstrap_1 = require('react-bootstrap');
var NavigationBar = function() {
	return React.createElement(
		react_bootstrap_1.Navbar,
		{ collapseOnSelect: true, expand: 'lg', bg: 'dark', variant: 'dark' },
		React.createElement(
			react_bootstrap_1.Navbar.Brand,
			{ href: '#home' },
			React.createElement('img', {
				alt: '',
				src:
					'https://cloud.githubusercontent.com/assets/2883345/11322975/9e575dce-910b-11e5-9f47-1fb1b530a4bd.png',
				width: '30',
				height: '30',
				className: 'd-inline-block align-top',
			}),
			' ',
			'RC Connect',
		),
		React.createElement(react_bootstrap_1.Navbar.Toggle, {
			'aria-controls': 'responsive-navbar-nav',
		}),
		React.createElement(
			react_bootstrap_1.Navbar.Collapse,
			{ id: 'responsive-navbar-nav' },
			React.createElement(
				react_bootstrap_1.Nav,
				{ className: 'mr-auto' },
				React.createElement(
					react_bootstrap_1.Nav.Link,
					{ href: '/overview' },
					'Overview',
				),
				React.createElement(
					react_bootstrap_1.Nav.Link,
					{ href: '/discover' },
					'Discover',
				),
				React.createElement(
					react_bootstrap_1.Nav.Link,
					{ href: '/network' },
					'My Network',
				),
			),
			React.createElement(
				react_bootstrap_1.Nav,
				null,
				React.createElement(react_bootstrap_1.Navbar.Brand, null, 'User: '),
				React.createElement(
					react_bootstrap_1.Navbar.Brand,
					{ href: '#home' },
					React.createElement('img', {
						alt: '',
						src:
							'https://d29xw0ra2h4o4u.cloudfront.net/assets/people/no_photo_150-63579d0fab12c3d73ec0a2d65f7dfee8ee6c03771daddf3f2dc40487046038e8.jpg',
						width: '30',
						height: '30',
						className: 'd-inline-block align-top',
					}),
					' ',
				),
			),
		),
	);
};
exports.NavigationBar = NavigationBar;
