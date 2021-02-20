import * as React from 'react';
import ForceGraph2D, { NodeObject } from 'react-force-graph-2d';
import { RecurserNode } from '../../types/RecurserGraph';
import { Dialog } from '@material-ui/core';
import { RecurserCard } from '../RecurserCard/RecurserCard';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';

interface Props {}

export const NetworkGraph: React.FC<Props> = () => {
	const [open, setOpen] = React.useState(false);
	const { fgRef, graphData, currNode, setCurrNode } = React.useContext(
		NetworkContext,
	);

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
		setCurrNode(node as RecurserNode);
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

	// function getNodeMap() {
	//     return new Map<string | number | undefined, RecurserNode>(
	//         graphData.nodes.map(obj => [obj.id, obj])
	//     );
	// }

	// function getLinkMap() {
	//     let linkMap: Map<string | number | undefined, Array<RecurserEdge>> = new Map();
	//     let graphLinks: Array<RecurserEdge> = graphData.links;
	//     for (let i = 0; i < graphLinks.length; i++) {
	//         let link: RecurserEdge = graphLinks[i];
	//         if (linkMap.has(link.source)) {
	//             linkMap.set(link.source, linkMap.get(link.source).push(link))
	//         } else {
	//             linkMap.set(link.source, [link]);
	//         }
	//     }
	// }

	// TEST CODE BELOW

	// const [highlightNodes, setHighlightNodes] = React.useState(new Set());
	// const [highlightLinks, setHighlightLinks] = React.useState(new Set());

	// const updateHighlight = () => {
	//     setHighlightNodes(highlightNodes);
	//     setHighlightLinks(highlightLinks);
	// };

	// const handleLinkHover = (link: LinkObject | null) => {
	//     highlightNodes.clear();
	//     highlightLinks.clear();

	//     if (link) {
	//         highlightLinks.add(link);
	//         highlightNodes.add(link.source);
	//         highlightNodes.add(link.target);
	//         // link.weight = 10;
	//     }

	//     updateHighlight();
	// };

	// onLinkHover={handleLinkHover}
	// linkDirectionalParticleWidth={(link: LinkObject) => highlightLinks.has(link) ? 6 : 1.4}

	// END OF TEST CODE

	return (
		<div>
			<Dialog onClose={handleDialogClose} open={open}>
				<RecurserCard node={currNode} />
			</Dialog>
			<ForceGraph2D
				ref={fgRef}
				graphData={graphData}
				nodeLabel="name"
				nodeAutoColorBy="batchName"
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
