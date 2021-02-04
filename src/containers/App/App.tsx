import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { Discover } from '../Discover/Discover';
import { Home } from '../Home/Home';
import { Network } from '../Network/Network';
import { Feed } from '../Feed/Feed';
import { Login } from '../Login/Login';
import {
	ProtectedRoute,
	ProtectedRouteProps,
} from '../../components/ProtectedRoute/ProtectedRoute';
import { Route, Switch } from 'react-router-dom';
import { useSessionContext } from '../../contexts/SessionContext/SessionContext';

// https://stackoverflow.com/questions/59422159/redirecting-a-user-to-the-page-they-requested-after-successful-authentication-wi/59423442#59423442
const App: React.FC = () => {
	const [sessionContext, updateSessionContext] = useSessionContext();

	const setRedirectPathOnAuthentication = (path: string) => {
		updateSessionContext({
			...sessionContext,
			redirectPathOnAuthentication: path,
		});
	};

	const defaultProtectedRouteProps: ProtectedRouteProps = {
		isAuthenticated: !!sessionContext.isAuthenticated,
		authenticationPath: '/login',
		redirectPathOnAuthentication:
			sessionContext.redirectPathOnAuthentication || '',
		setRedirectPathOnAuthentication,
	};

	return (
		<div>
			<Switch>
				<Route path={['/', '/home']} exact component={Home} />
				<ProtectedRoute
					{...defaultProtectedRouteProps}
					path="/feed"
					exact
					component={Feed}
				/>
				<Route
					path="/network"
					exact
					render={props => <Network {...props} profileID={3721} />}
				/>
				<ProtectedRoute
					{...defaultProtectedRouteProps}
					path="/network"
					exact
					component={Network}
				/>
				<ProtectedRoute
					{...defaultProtectedRouteProps}
					path="/discover"
					exact
					component={Discover}
				/>
				<Route path="/login" exact component={Login} />
				<Route path="/" render={() => <div>404 Not Found</div>} />
			</Switch>
		</div>
	);
};
export default App;
