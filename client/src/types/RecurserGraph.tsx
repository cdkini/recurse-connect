import { NodeObject } from 'react-force-graph-2d';

export type RecurserId = string | number | undefined;

export interface RecurserNode extends NodeObject {
	id: RecurserId;
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
	color: string | undefined;
}

export interface RecurserEdge {
	source: RecurserNode;
	target: RecurserNode;
	weight: number;
	color: string | undefined;
}

export interface RecurserGraph {
	nodes: Array<RecurserNode>;
	links: Array<RecurserEdge>;
}
