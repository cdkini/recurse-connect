import * as React from 'react';
import { createContext } from 'react';
import { RecurserNode } from '../../types/RecurserGraph';
import { RecurserNote } from '../../types/RecurserNote';

interface ContextProps {
	profileId: number;
	profiles: Array<RecurserNode>;
	notes: Array<RecurserNote>;
	focusedNote: RecurserNote | null;
	setFocusedNote: React.Dispatch<React.SetStateAction<RecurserNote | null>>;
}

export const NotesContext = createContext<ContextProps>({} as ContextProps);
