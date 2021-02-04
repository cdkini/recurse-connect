import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

interface Props {}

export const Login: React.FC<Props> = () => {
	const [temp, setTemp] = React.useState(0);
	React.useEffect(() => {
		fetch('/api/v1/login')
			.then(res => res.json())
			.then(data => {
				setTemp(data);
			});
	}, []);
	console.log(temp);
	return (
		<div>
			<NavigationBar />
			<div>Login</div>
		</div>
	);
};
