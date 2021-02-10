import * as React from 'react';
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
// import { RecurserCard } from '../../components/RecurserCard/RecurserCard';

interface Props {
	profileID: number;
}

export const Network: React.FC<Props> = ({ profileID }) => {
	const [graphData, setGraphData] = React.useState({ nodes: [], links: [] });
	React.useEffect(() => {
		fetch('/api/v1/graph/' + profileID.toString())
			.then(res => res.json())
			.then(data => {
				setGraphData(data);
			});
	}, []);

	const { useRef } = React;
	const fgRef = useRef() as any;

	const handleNodeClick = (node: NodeObject) => {
		fgRef.current.zoom(8, 2000);
		fgRef.current.centerAt(node.x, node.y, 1000);
	};

	const handleNodeRightClick = (node: NodeObject) => {
		console.log(node); // TODO: Open to implement cards
	};

	const handleBackgroundClick = () => {
		fgRef.current.zoom(3, 2000);
		fgRef.current.centerAt(0, 0, 1000);
	};

	const handleBackgroundRightClick = () => {
		fgRef.current.zoom(1, 2000);
		fgRef.current.centerAt(0, 0, 1000);
	};

	return (
		<div>
			<NavigationBar />
			<div>Network</div>
			<ForceGraph2D
				ref={fgRef}
				graphData={graphData}
				nodeLabel="name"
				nodeAutoColorBy="name"
				linkDirectionalParticles={2}
				linkDirectionalParticleWidth={1.4}
				onNodeClick={handleNodeClick}
				onNodeRightClick={handleNodeRightClick}
				onBackgroundClick={handleBackgroundClick}
				onBackgroundRightClick={handleBackgroundRightClick}
			/>
		</div>
	);
};
