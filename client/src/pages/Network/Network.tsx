import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { NetworkGraph } from '../../components/NetworkGraph/NetworkGraph';
import { FuzzySearchBar } from '../../components/FuzzySearchBar/FuzzySearchBar';
import { RecurserGraph, RecurserNode } from '../../types/RecurserGraph';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';

interface Props {
	profileId: number;
}

export const Network: React.FC<Props> = (props: Props) => {
	const [graphData, setGraphData] = React.useState<RecurserGraph>({
		nodes: [],
		links: [],
	});

	React.useEffect(() => {
		fetch('/api/v1/graph/' + props.profileId.toString())
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

	return (
		<NetworkContext.Provider
			value={{ fgRef, graphData, setGraphData, userNode, setUserNode }}
		>
			<NavigationBar />
			<NetworkGraph />
			<FuzzySearchBar />
		</NetworkContext.Provider>
	);
};
