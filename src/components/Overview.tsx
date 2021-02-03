import * as React from 'react';
import { NavigationBar } from './NavigationBar';

interface Props {}

export const Overview: React.FC<Props> = () => {
	return (
		<div>
			<NavigationBar />
			<div>Overview</div>
		</div>
	);
};
