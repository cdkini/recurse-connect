import * as React from 'react';
import { NavigationBar } from './NavigationBar';
import ForceGraph2D from 'react-force-graph-2d';

interface Props {}

export const Network: React.FC<Props> = () => {
	const fgRef = React.useRef();
	const [graphData, setGraphData] = React.useState({ nodes: [], links: [] });
	React.useEffect(() => {
		fetch('/api/graph/498')
			.then(res => res.json())
			.then(data => {
				setGraphData(data);
			});
	}, []);
	return (
		<div>
			<NavigationBar />
			<div>Network</div>
			<ForceGraph2D ref={fgRef} graphData={graphData} cooldownTicks={100} />;
		</div>
	);
};
