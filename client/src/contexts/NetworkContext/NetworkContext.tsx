import { createContext } from 'react';
import { RecurserGraph, RecurserNode } from '../../types/RecurserGraph';

interface ContextProps {
	fgRef: any;
	graphData: RecurserGraph;
	setGraphData: React.Dispatch<React.SetStateAction<RecurserGraph>>;
	currNode: RecurserNode;
	setCurrNode: React.Dispatch<React.SetStateAction<RecurserNode>>;
}

export const NetworkContext = createContext<ContextProps>({} as ContextProps);
