import * as React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

interface Props {}

export const NavigationBar: React.FC<Props> = () => {
	return (
		<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
			<Navbar.Brand href="#home">
				<img
					alt=""
					src="https://cloud.githubusercontent.com/assets/2883345/11322975/9e575dce-910b-11e5-9f47-1fb1b530a4bd.png"
					width="30"
					height="30"
					className="d-inline-block align-top"
				/>{' '}
				RC Connect
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link href="/overview">Overview</Nav.Link>
					<Nav.Link href="/discover">Discover</Nav.Link>
					<Nav.Link href="/network">My Network</Nav.Link>
				</Nav>
				<Nav>
					<Navbar.Brand>User: </Navbar.Brand>
					<Navbar.Brand href="#home">
						<img
							alt=""
							src="https://d29xw0ra2h4o4u.cloudfront.net/assets/people/no_photo_150-63579d0fab12c3d73ec0a2d65f7dfee8ee6c03771daddf3f2dc40487046038e8.jpg"
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>{' '}
					</Navbar.Brand>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};
