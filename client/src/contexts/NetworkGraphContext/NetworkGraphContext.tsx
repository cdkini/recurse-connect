import { createContext } from 'react';
import { RecurserNode } from '../../types/RecurserGraph';

interface ContextProps {
	focusedNode: RecurserNode;
	openDialog: boolean;
	handleDialogClose: () => void;
}

export const NetworkGraphContext = createContext<ContextProps>(
	{} as ContextProps,
);
