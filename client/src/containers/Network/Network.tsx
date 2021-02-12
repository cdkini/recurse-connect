import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { NetworkGraph } from '../../components/NetworkGraph/NetworkGraph';

interface Props {
	profileID: number;
}

export const Network: React.FC<Props> = (props: Props) => {
	return (
		<div>
			<NavigationBar />
			<NetworkGraph profileId={props.profileID} />
		</div>
	);
};
