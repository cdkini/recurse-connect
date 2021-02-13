import { NodeObject } from 'react-force-graph-2d';

export interface GraphNode extends NodeObject {
	id: string | number | undefined;
	name: string | undefined;
	profilePath: string | undefined;
	imagePath: string | undefined;
	location: string | undefined;
	company: number | undefined;
	bio: string | undefined;
	interests: string | undefined;
	beforeRc: string | undefined;
	duringRc: string | undefined;
	email: string | undefined;
	github: string | undefined;
	twitter: string | undefined;
	batchName: string | undefined;
	batchShortName: string | undefined;
	start_date: Date | undefined;
	end_date: Date | undefined;
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
