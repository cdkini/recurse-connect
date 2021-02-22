import Fuse from 'fuse.js';
import { RecurserNode } from '../../types/RecurserGraph';
import { createContext } from 'react';
import { Pathfinder } from '../../utils/graphUtils';

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
	recurserSearchValue: RecurserNode | null;
	setRecurserSearchValue: React.Dispatch<
		React.SetStateAction<RecurserNode | null>
	>;
	recurserInputValue: string;
	setRecurserInputValue: React.Dispatch<React.SetStateAction<string>>;
	pathfinder: Pathfinder;
	openAlert: boolean;
	setOpenAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FuzzySearchContext = createContext<FuzzySearchProps>(
	{} as FuzzySearchProps,
);
