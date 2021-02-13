import * as React from 'react';
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
import { GraphObject, GraphNode } from '../../types/GraphObject';
import { Dialog } from '@material-ui/core';
import { RecurserCard } from '../RecurserCard/RecurserCard';

interface Props {
	profileId: number;
}

export const NetworkGraph: React.FC<Props> = (props: Props) => {
	const [graphData, setGraphData] = React.useState<GraphObject>({
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

	const [currNode, setCurrNode] = React.useState<GraphNode>({} as GraphNode);

	React.useEffect(() => {
		fetch('/api/v1/users/' + props.profileId.toString())
			.then(res => res.json())
			.then(data => {
				setCurrNode(data);
			});
	}, []);

	const [open, setOpen] = React.useState(false);

	const handleDialogOpen = () => {
		setOpen(true);
	};
	const handleDialogClose = () => {
		setOpen(false);
	};

	const { useRef } = React;
	const fgRef = useRef() as any;

	const handleNodeClick = (node: NodeObject) => {
		fgRef.current.zoom(8, 2000);
		fgRef.current.centerAt(node.x, node.y, 1000);
	};

	const handleNodeRightClick = (node: NodeObject) => {
		setCurrNode(node as GraphNode);
		console.log(node);
		handleDialogOpen();
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
			<Dialog onClose={handleDialogClose} open={open}>
				<RecurserCard node={currNode} />
			</Dialog>
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
