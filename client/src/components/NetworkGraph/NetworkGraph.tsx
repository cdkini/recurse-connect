import * as React from 'react';
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
import { RecurserNode } from '../../types/RecurserGraph';
import { Dialog } from '@material-ui/core';
import { RecurserCard } from '../RecurserCard/RecurserCard';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import { NetworkGraphContext } from '../../contexts/NetworkGraphContext/NetworkGraphContext';

interface Props {}

export const NetworkGraph: React.FC<Props> = () => {
	const [open, setOpen] = React.useState(false);
	const { fgRef, graphData, userNode } = React.useContext(NetworkContext);
	const [focusedNode, setFocusedNode] = React.useState(userNode);
	const [alertMessage, setAlertMessage] = React.useState('');
	const [alertSeverity, setAlertSeverity] = React.useState<
		'error' | 'warning' | 'info' | 'success' | undefined
	>(undefined);

	const handleDialogOpen = () => {
		setOpen(true);
	};
	const handleDialogClose = () => {
		setOpen(false);
	};

	const handleNodeClick = (node: NodeObject) => {
		fgRef.current.zoom(8, 2000);
		fgRef.current.centerAt(node.x, node.y, 1000);
	};

	const handleNodeRightClick = (node: NodeObject) => {
		setFocusedNode(node as RecurserNode);
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
		<NetworkGraphContext.Provider
			value={{ alertMessage, setAlertMessage, alertSeverity, setAlertSeverity }}
		>
			<Dialog onClose={handleDialogClose} open={open}>
				<RecurserCard node={focusedNode} />
			</Dialog>
			<ForceGraph2D
				ref={fgRef}
				graphData={graphData}
				nodeLabel="name"
				nodeAutoColorBy="id"
				onNodeClick={handleNodeClick}
				onNodeRightClick={handleNodeRightClick}
				onBackgroundClick={handleBackgroundClick}
				onBackgroundRightClick={handleBackgroundRightClick}
				linkDirectionalParticles={1.4}
				linkDirectionalParticleWidth={2}
				onLinkHover={link => console.log(link)}
			/>
		</NetworkGraphContext.Provider>
	);
};
