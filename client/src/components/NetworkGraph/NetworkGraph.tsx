import * as React from 'react';
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
import { RecurserNode } from '../../types/RecurserGraph';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import { NetworkGraphContext } from '../../contexts/NetworkGraphContext/NetworkGraphContext';
import { RecurserCardDialog } from '../RecurserCardDialog/RecurserCardDialog';

interface Props {}

export const NetworkGraph: React.FC<Props> = () => {
	const [openDialog, setOpenDialog] = React.useState(false);
	const { fgRef, graphData, userNode } = React.useContext(NetworkContext);
	const [focusedNode, setFocusedNode] = React.useState(userNode);
	const [alertMessage, setAlertMessage] = React.useState('');
	const [alertSeverity, setAlertSeverity] = React.useState<
		'error' | 'warning' | 'info' | 'success' | undefined
	>(undefined);

	const handleDialogOpen = () => {
		setOpenDialog(true);
	};
	const handleDialogClose = () => {
		setOpenDialog(false);
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
			value={{
				alertMessage,
				setAlertMessage,
				alertSeverity,
				setAlertSeverity,
				focusedNode,
				openDialog,
				handleDialogClose,
			}}
		>
			<RecurserCardDialog />
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
			/>
		</NetworkGraphContext.Provider>
	);
};
