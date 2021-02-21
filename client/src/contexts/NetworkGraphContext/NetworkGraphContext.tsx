import { createContext } from 'react';
import { RecurserNode } from '../../types/RecurserGraph';

interface ContextProps {
	alertMessage: string;
	setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
	alertSeverity: 'error' | 'warning' | 'info' | 'success' | undefined;
	setAlertSeverity: React.Dispatch<
		React.SetStateAction<'error' | 'warning' | 'info' | 'success' | undefined>
	>;
	focusedNode: RecurserNode;
	openDialog: boolean;
	handleDialogClose: () => void;
}

export const NetworkGraphContext = createContext<ContextProps>(
	{} as ContextProps,
);
