import * as React from 'react';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { NetworkGraph } from '../../components/NetworkGraph/NetworkGraph';
import { FuzzySearchBar } from '../../components/FuzzySearchBar/FuzzySearchBar';
import { RecurserGraph, RecurserNode } from '../../types/RecurserGraph';

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

	const [currNode, setCurrNode] = React.useState<RecurserNode>(
		{} as RecurserNode,
	);

	React.useEffect(() => {
		fetch('/api/v1/users/' + props.profileId.toString())
			.then(res => res.json())
			.then(data => {
				setCurrNode(data);
			});
	}, []);

	return (
		<div>
			<NavigationBar />
			<NetworkGraph
				profileId={props.profileId}
				graphData={graphData}
				setGraphData={setGraphData}
				currNode={currNode}
				setCurrNode={setCurrNode}
			/>
			<FuzzySearchBar graphData={graphData} />
		</div>
	);
};
