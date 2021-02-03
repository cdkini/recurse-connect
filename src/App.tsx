import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { Home } from './components/Home';
import { Overview } from './components/Overview';
import { Discover } from './components/Discover';
import { Network } from './components/Network';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/overview" exact component={Overview} />
				<Route path="/discover" exact component={Discover} />
				<Route path="/network" exact component={Network} />
				<Route path="/" render={() => <div>404</div>} />
			</Switch>
		</BrowserRouter>
	);
};
export default App;
