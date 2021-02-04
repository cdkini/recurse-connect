import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

interface Props {}

export const Overview: React.FC<Props> = () => {
	return (
		<div>
			<NavigationBar />
			<div>Overview</div>
		</div>
	);
};
