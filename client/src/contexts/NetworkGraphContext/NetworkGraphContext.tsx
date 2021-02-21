import { createContext } from 'react';

interface ContextProps {
	alertMessage: string;
	setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
	alertSeverity: 'error' | 'warning' | 'info' | 'success' | undefined;
	setAlertSeverity: React.Dispatch<
		React.SetStateAction<'error' | 'warning' | 'info' | 'success' | undefined>
	>;
}

export const NetworkGraphContext = createContext<ContextProps>(
	{} as ContextProps,
);
