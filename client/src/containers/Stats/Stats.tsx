import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

interface Props {}

export const Stats: React.FC<Props> = () => {
	return (
		<div>
			<NavigationBar />
			<div>Feed</div>
		</div>
	);
};
