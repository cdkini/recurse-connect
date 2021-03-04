import { Autocomplete } from '@material-ui/lab';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import * as React from 'react';
import { RecurserNode } from '../../types/RecurserGraph';
import { TextField, FormHelperText, FormControl } from '@material-ui/core';
import { FuzzySearchContext } from '../../contexts/FuzzySearchContext/FuzzySearchContext';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import { AlgoArgs } from '../../utils/graphUtils';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		formControl: {
			background: '#3dc06c',
			display: 'flex',
			flexGrow: 1,
			margin: theme.spacing(1),
			marginRight: theme.spacing(2),
			maxWidth: 300,
			minWidth: 120,
		},
	}),
);

interface Props {
	animationSpeed: number | Array<number>;
	selectedAlgo: string;
}

export const RecurserSearch: React.FC<Props> = (props: Props) => {
	const classes = useStyles();
	const { userNode, graphData } = React.useContext(NetworkContext);
	const {
		recurserSearchValue,
		setRecurserSearchValue,
		recurserInputValue,
		setRecurserInputValue,
		pathfinder,
		setOpenAlert,
	} = React.useContext(FuzzySearchContext);

	const handleRecurserSearchSubmit = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13 && recurserSearchValue) {
			setOpenAlert(true);
			pathfinder.runSelectedAlgo(props.selectedAlgo, {
				sourceId: userNode.id,
				targetId: recurserSearchValue.id,
				animationDelay: props.animationSpeed,
			});
		}
	};

	return (
		<FormControl className={classes.formControl}>
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
				style={{ width: 250 }}
				renderInput={params => (
					<TextField label={<strong>Search by Recurser</strong>} {...params} />
				)}
				onKeyDown={handleRecurserSearchSubmit}
			/>
			<FormHelperText>
				Your search query <i>(Enter to submit)</i>
			</FormHelperText>
		</FormControl>
	);
};
