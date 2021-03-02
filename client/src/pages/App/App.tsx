import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { Discover } from '../Discover/Discover';
import { Home } from '../Home/Home';
import { Network } from '../Network/Network';
import { Stats } from '../Stats/Stats';
import { Login } from '../Login/Login';
import {
	ProtectedRoute,
	ProtectedRouteProps,
} from '../../components/ProtectedRoute/ProtectedRoute';
import { Switch, Route } from 'react-router-dom';
import { useSessionContext } from '../../contexts/SessionContext/SessionContext';
import { Notes } from '../Notes/Notes';

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
				<Route path="/stats" exact component={Stats} />
				<Route
					path="/network"
					exact
					render={props => <Network {...props} profileId={3721} />}
				/>
				<Route
					path="/notes"
					exact
					render={props => <Notes {...props} profileId={3721} />}
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
