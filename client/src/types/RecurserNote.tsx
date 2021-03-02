import { RecurserId } from './RecurserGraph';
import { Node } from 'slate';

export interface RecurserNote {
	title: string;
	date: Date;
	participants: Array<RecurserId>;
	tags: string;
	content: Node[];
	id: string;
}
