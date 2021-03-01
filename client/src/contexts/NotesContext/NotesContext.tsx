import { createContext } from 'react';
import { RecurserGraph } from '../../types/RecurserGraph';
import { RecurserNote } from '../../types/RecurserNote';

interface ContextProps {
	profileId: number;
	graphData: RecurserGraph;
	notes: Array<RecurserNote>;
}

export const NotesContext = createContext<ContextProps>({} as ContextProps);
