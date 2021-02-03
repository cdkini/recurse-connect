import * as React from 'react';
import { NavigationBar } from './NavigationBar';

interface Props {}

export const Home: React.FC<Props> = () => {
	const [currentTest, setCurrentTest] = React.useState(0);
	React.useEffect(() => {
		fetch('/test')
			.then(res => res.json())
			.then(data => {
				setCurrentTest(data.test);
			});
	}, []);
	return (
		<div>
			<NavigationBar />
			<div>Home</div>
			<div>{currentTest}</div>
		</div>
	);
};
