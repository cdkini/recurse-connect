import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

interface Props {}

export const Discover: React.FC<Props> = (): JSX.Element => {
	return (
		<div>
			<NavigationBar />
			<div>Discover</div>
		</div>
	);
};
