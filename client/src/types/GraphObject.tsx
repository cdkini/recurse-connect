import { NodeObject } from 'react-force-graph-2d';

export interface GraphNode extends NodeObject {
	batch: string;
	beforeRc: string | undefined;
	bio: string | undefined;
	company: number | undefined;
	duringRc: string | undefined;
	email: string | undefined;
	github: string | undefined;
	id: string | number;
	imagePath: string;
	interests: string | undefined;
	location: string | undefined;
	name: string;
	profilePath: string;
	twitter: string | undefined;
}

export interface GraphEdge {
	source: number;
	target: number;
	weight: number;
}

export interface GraphObject {
	nodes: Array<GraphNode>;
	links: Array<GraphEdge>;
}
