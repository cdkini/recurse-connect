import * as React from 'react';
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
import { RecurserGraph, RecurserNode } from '../../types/RecurserGraph';
import { Dialog } from '@material-ui/core';
import { RecurserCard } from '../RecurserCard/RecurserCard';

interface Props {
	profileId: number;
	graphData: RecurserGraph;
	setGraphData: React.Dispatch<React.SetStateAction<RecurserGraph>>;
	currNode: RecurserNode;
	setCurrNode: (node: RecurserNode) => void;
}

export const NetworkGraph: React.FC<Props> = (props: Props) => {
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
		props.setCurrNode(node as RecurserNode);
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
				<RecurserCard node={props.currNode} />
			</Dialog>
			<ForceGraph2D
				ref={fgRef}
				graphData={props.graphData}
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
