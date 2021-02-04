import * as React from 'react';
import { Session, initialSession } from '../../models/session/session';
import { createContext, useContext, useState } from 'react';

export const SessionContext = createContext<
	[Session, (session: Session) => void]
>([initialSession, () => {}]);
export const useSessionContext = () => useContext(SessionContext);

export const SessionContextProvider: React.FC = props => {
	const [sessionState, setSessionState] = useState(initialSession);
	const defaultSessionContext: [Session, typeof setSessionState] = [
		sessionState,
		setSessionState,
	];

	return (
		<SessionContext.Provider value={defaultSessionContext}>
			{props.children}
		</SessionContext.Provider>
	);
};
