import * as React from 'react';
import { Home } from './components/Home';
import { Overview } from './components/Overview';
import { Discover } from './components/Discover';
import { Network } from './components/Network';
import { BrowserRouter, Route } from 'react-router-dom';

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Route path="/" component={Home} />
			<Route path="/overview" component={Overview} />
			<Route path="/discover" component={Discover} />
			<Route path="/network" component={Network} />
		</BrowserRouter>
	);
};
export default App;
