import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from './contexts/SessionContext/SessionContext';
import App from './containers/App/App';

const createApp = () => {
	return (
		<BrowserRouter>
			<SessionContextProvider>
				<App />
			</SessionContextProvider>
		</BrowserRouter>
	);
};

ReactDOM.render(createApp(), document.getElementById('root'));
