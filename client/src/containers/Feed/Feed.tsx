import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

interface Props {}

export const Feed: React.FC<Props> = (): JSX.Element => {
	return (
		<div>
			<NavigationBar />
			<div>Feed</div>
		</div>
	);
};
