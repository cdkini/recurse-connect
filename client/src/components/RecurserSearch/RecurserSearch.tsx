import { Autocomplete } from '@material-ui/lab';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import * as React from 'react';
import { RecurserNode } from '../../types/RecurserGraph';
import { TextField } from '@material-ui/core';
import { FuzzySearchContext } from '../../contexts/FuzzySearchContext/FuzzySearchContext';

interface Props {}

export const RecurserSearch: React.FC<Props> = () => {
	const { userNode, graphData } = React.useContext(NetworkContext);
	const {
		recurserSearchValue,
		setRecurserSearchValue,
		recurserInputValue,
		setRecurserInputValue,
		pathfinder,
	} = React.useContext(FuzzySearchContext);

	const handleRecurserSearchSubmit = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13 && recurserSearchValue) {
			pathfinder.depthFirstSearch(userNode.id, recurserSearchValue.id);
		}
	};

	return (
		<Autocomplete
			value={recurserSearchValue}
			onChange={(_event: any, newValue: RecurserNode | null) => {
				setRecurserSearchValue(newValue);
			}}
			inputValue={recurserInputValue}
			onInputChange={(_event, newInputValue) => {
				setRecurserInputValue(newInputValue);
			}}
			id="controllable-states-demo"
			options={graphData.nodes}
			getOptionLabel={option => `${option.name} (${option.batchShortName})`}
			style={{ width: 300 }}
			renderInput={params => (
				<TextField
					{...params}
					label="Search by Recurser name"
					variant="outlined"
				/>
			)}
			onKeyDown={handleRecurserSearchSubmit}
		/>
	);
};
