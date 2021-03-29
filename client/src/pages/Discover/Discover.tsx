import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { NetworkGraph } from '../../components/NetworkGraph/NetworkGraph';
import { FuzzySearchBar } from '../../components/FuzzySearchBar/FuzzySearchBar';
import { RecurserGraph, RecurserNode } from '../../types/RecurserGraph';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';

interface Props {
	profileId: number;
}

export const Discover: React.FC<Props> = (props: Props) => {
	const [graphData, setGraphData] = React.useState<RecurserGraph>({
		nodes: [],
		links: [],
	});

	React.useEffect(() => {
		fetch('/api/v1/graph/')
			.then(res => res.json())
			.then(data => {
				setGraphData(data);
			});
	}, []);

	const [userNode, setUserNode] = React.useState<RecurserNode>(
		{} as RecurserNode,
	);

	React.useEffect(() => {
		fetch('/api/v1/users/' + props.profileId.toString())
			.then(res => res.json())
			.then(data => {
				setUserNode(data);
			});
	}, []);

	const { useRef } = React;
	const fgRef = useRef() as any;
	const profileId = props.profileId;

	return (
		<NetworkContext.Provider
			value={{
				profileId,
				fgRef,
				graphData,
				setGraphData,
				userNode,
				setUserNode,
			}}
		>
			<NavigationBar />
			<NetworkGraph />
			<FuzzySearchBar />
		</NetworkContext.Provider>
	);
};
