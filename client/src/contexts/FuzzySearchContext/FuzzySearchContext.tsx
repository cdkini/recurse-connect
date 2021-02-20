import Fuse from 'fuse.js';
import { RecurserNode } from '../../types/RecurserGraph';
import { createContext } from 'react';

interface FuzzySearchProps {
	searchResults: Array<Fuse.FuseResult<RecurserNode>>;
	setSearchResults: React.Dispatch<
		React.SetStateAction<Array<Fuse.FuseResult<RecurserNode>>>
	>;
	selectedResults: Set<Fuse.FuseResult<RecurserNode>>;
	setSelectedResults: React.Dispatch<
		React.SetStateAction<Set<Fuse.FuseResult<RecurserNode>>>
	>;
	openDialog: boolean;
	setOpenDialog: React.Dispatch<boolean>;
}

export const FuzzySearchContext = createContext<FuzzySearchProps>(
	{} as FuzzySearchProps,
);
