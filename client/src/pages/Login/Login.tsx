import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

interface Props {}

export const Login: React.FC<Props> = () => {
	// const [temp, setTemp] = React.useState<any>(null);

	React.useEffect(() => {
		fetch('/api/v1/login', {
			method: 'GET',
			headers: {
				// 'Access-Control-Allow-Origin': 'http://localhost:5000',
				// 'Accept': 'application/json',
				// 'Content-Type': 'application/json',
			},
		}).then(response => console.log(response));
	}, []);

	return (
		<div>
			<NavigationBar />
			<div>Login</div>
		</div>
	);
};
