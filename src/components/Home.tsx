import * as React from 'react';
import { NavigationBar } from './NavigationBar';

interface Props {}

export const Home: React.FC<Props> = () => {
	return (
		<div>
			<NavigationBar />
			<div>Home</div>
		</div>
	);
};
