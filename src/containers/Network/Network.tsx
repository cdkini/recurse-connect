import * as React from 'react';
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';

interface Props {
	profileID: number;
}

export const Network: React.FC<Props> = ({ profileID }) => {
	const { useRef } = React;
	const fgRef = useRef() as any;

	const [graphData, setGraphData] = React.useState({ nodes: [], links: [] });
	React.useEffect(() => {
		fetch('/api/v1/graph/' + profileID.toString())
			.then(res => res.json())
			.then(data => {
				setGraphData(data);
			});
	}, []);

	const handleNodeClick = (node: NodeObject) => {
		fgRef.current.zoom(8, 2000);
		fgRef.current.centerAt(node.x, node.y, 1000);
	};

	const handleBackgroundClick = () => {
		fgRef.current.zoom(5, 2000);
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
				nodeAutoColorBy="id"
				onNodeClick={handleNodeClick}
				linkDirectionalParticles={2}
				linkDirectionalParticleWidth={1.4}
				onBackgroundClick={handleBackgroundClick}
				onBackgroundRightClick={handleBackgroundRightClick}
			/>
			,
		</div>
	);
};
