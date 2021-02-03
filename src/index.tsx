import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './containers/App';
import { SessionContextProvider } from './contexts/SessionContext';
import { BrowserRouter } from 'react-router-dom';

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
