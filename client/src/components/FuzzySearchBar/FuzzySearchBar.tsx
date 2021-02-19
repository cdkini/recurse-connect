import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Fuse from 'fuse.js';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import { FormHelperText, TextField } from '@material-ui/core';
import { RecurserGraph, RecurserNode } from '../../types/RecurserGraph';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { FuzzySearchResults } from '../FuzzySearchResults/FuzzySearchResults';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		appBar: {
			background: '#3dc06c',
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
			maxWidth: 300,
		},
		extendedIcon: {
			marginRight: theme.spacing(1),
		},
	}),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const criteria = [
	'name',
	'location',
	'company',
	'interests',
	'batchName',
	'bio',
	'beforeRc',
	'duringRc',
];

interface Props {
	graphData: RecurserGraph;
	setGraphData: React.Dispatch<React.SetStateAction<RecurserGraph>>;
	currNode: RecurserNode;
	setCurrNode: (node: RecurserNode) => void;
	fgRef: any;
}

export const FuzzySearchBar: React.FC<Props> = props => {
	const classes = useStyles();

	const [openDialog, setOpenDialog] = React.useState<boolean>(false);
	const [searchCriteria, setSearchCriteria] = React.useState<Array<string>>([]);
	const [searchQuery, setSearchQuery] = React.useState<string>('');
	const [searchResults, setSearchResults] = React.useState<
		Array<Fuse.FuseResult<RecurserNode>>
	>([]);
	const [selectedResults, setSelectedResults] = React.useState<
		Set<Fuse.FuseResult<RecurserNode>>
	>(new Set<Fuse.FuseResult<RecurserNode>>());
	const [
		recurserSearchValue,
		setRecurserSearchValue,
	] = React.useState<RecurserNode | null>(props.currNode);
	const [recurserInputValue, setRecurserInputValue] = React.useState('');

	const fuse = React.useMemo(() => {
		return new Fuse(props.graphData.nodes, {
			includeScore: true,
			keys: searchCriteria,
		});
	}, [searchCriteria]);

	const handleDialogOpen = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13) {
			let results = fuse.search(searchQuery);
			setSearchResults(results);
			setSelectedResults(new Set(results));
			setOpenDialog(true);
		}
	};

	const handleCriteriaChange = (
		event: React.ChangeEvent<{ value: unknown }>,
	) => {
		setSearchCriteria(event.target.value as string[]);
	};

	const handleQueryChange = (event: React.ChangeEvent<{ value: string }>) => {
		setSearchQuery(event.target.value);
	};

	const handleRecurserSearchSubmit = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13 && recurserSearchValue) {
			props.fgRef.current.zoom(8, 2000);
			props.fgRef.current.centerAt(
				recurserSearchValue.x,
				recurserSearchValue.y,
				1000,
			);
		}
	};

	return (
		<div className={classes.root}>
			<FuzzySearchResults
				graphData={props.graphData}
				setGraphData={props.setGraphData}
				currNode={props.currNode}
				setCurrNode={props.setCurrNode}
				fgRef={props.fgRef}
				searchResults={searchResults}
				setSearchResults={setSearchResults}
				selectedResults={selectedResults}
				setSelectedResults={setSelectedResults}
				openDialog={openDialog}
				setOpenDialog={setOpenDialog}
			/>
			<AppBar className={classes.appBar} position="static">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
					>
						<FormControl className={classes.formControl}>
							<InputLabel>Criteria</InputLabel>
							<Select
								multiple
								value={searchCriteria}
								onChange={handleCriteriaChange}
								input={<Input />}
								renderValue={selected => (selected as string[]).join(', ')}
								MenuProps={MenuProps}
							>
								{criteria.map(criterion => (
									<MenuItem key={criterion} value={criterion}>
										<Checkbox
											checked={searchCriteria.indexOf(criterion) > -1}
										/>
										<ListItemText primary={criterion} />
									</MenuItem>
								))}
							</Select>
							<FormHelperText>What fields to search through</FormHelperText>
						</FormControl>
						<FormControl className={classes.formControl}>
							<TextField
								onChange={handleQueryChange}
								onKeyDown={handleDialogOpen}
								label="Query"
							/>
							<FormHelperText>
								Your search query <i>(Enter to submit)</i>
							</FormHelperText>
						</FormControl>
					</IconButton>
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
						options={props.graphData.nodes}
						getOptionLabel={option =>
							`${option.name} (${option.batchShortName})`
						}
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
				</Toolbar>
			</AppBar>
		</div>
	);
};
