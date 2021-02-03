import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import ProtectedRoute, {
	ProtectedRouteProps,
} from '../components/ProtectedRoute';
import { Route, Switch } from 'react-router-dom';
import { Discover } from '../components/Discover';
import { Home } from '../components/Home';
import { Network } from '../components/Network';
import { Overview } from '../components/Overview';
import { useSessionContext } from '../contexts/SessionContext';

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
				<Route path="/" exact component={Home} />
				<ProtectedRoute
					{...defaultProtectedRouteProps}
					path="/overview"
					exact
					component={Overview}
				/>
				<ProtectedRoute
					{...defaultProtectedRouteProps}
					path="/discover"
					exact
					component={Discover}
				/>
				<ProtectedRoute
					{...defaultProtectedRouteProps}
					path="/network"
					exact
					component={Network}
				/>
				<Route path="/login" />
				<Route path="/" render={() => <div>404 Not Found</div>} />
			</Switch>
		</div>
	);
};
export default App;
