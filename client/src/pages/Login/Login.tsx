import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

interface Props {}

export const Login: React.FC<Props> = () => {
	// const [temp, setTemp] = React.useState<any>(null);

	React.useEffect(() => {
		fetch('/api/v1/login', {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Origin': '*',
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			redirect: 'follow',
		}).then(response => {
			if (response.redirected) {
				window.location.href = response.url;
			}
		});
	}, []);

	return (
		<div>
			<NavigationBar />
			<div>Login</div>
		</div>
	);
};
