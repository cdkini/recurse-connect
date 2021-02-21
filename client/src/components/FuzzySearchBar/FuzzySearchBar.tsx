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
import { FuzzySearchContext } from '../../contexts/FuzzySearchContext/FuzzySearchContext';
import { FuzzySearchResults } from '../FuzzySearchResults/FuzzySearchResults';
import { RecurserNode, RecurserEdge } from '../../types/RecurserGraph';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
// import { NetworkGraphContext } from '../../contexts/NetworkGraphContext/NetworkGraphContext';
import { Alert } from '@material-ui/lab';

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

interface Props {}

export const FuzzySearchBar: React.FC<Props> = () => {
	const classes = useStyles();
	const { fgRef, userNode, graphData, setGraphData } = React.useContext(
		NetworkContext,
	);

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
	] = React.useState<RecurserNode | null>(userNode);
	const [recurserInputValue, setRecurserInputValue] = React.useState('');

	const [alertMessage, setAlertMessage] = React.useState('');
	const [alertSeverity, setAlertSeverity] = React.useState<
		'error' | 'warning' | 'info' | 'success' | undefined
	>(undefined);

	const fuse = React.useMemo(() => {
		return new Fuse(graphData.nodes, {
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

	const recurserNodeMap = graphData.nodes.reduce(function(map, obj) {
		map.set(obj.id, obj);
		return map;
	}, new Map<string | number | undefined, RecurserNode>());

	const recurserEdgeMap = graphData.links.reduce(function(map, obj) {
		map.has(obj.source.id)
			? map.get(obj.source.id)!.push(obj)
			: map.set(obj.source.id, [obj]);
		map.has(obj.target.id)
			? map.get(obj.target.id)!.push(obj)
			: map.set(obj.target.id, [obj]);
		return map;
	}, new Map<string | number | undefined, Array<RecurserEdge>>());

	function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	const prepareGraph = () => {
		for (let i = 0; i < graphData.nodes.length; i++) {
			if (graphData.nodes[i].profilePath) {
				graphData.nodes[i].color = 'grey';
			} else {
				graphData.nodes[i].color = '#000000';
			}
		}
		setGraphData(graphData);
	};

	function updateAlert(
		status: 'error' | 'warning' | 'info' | 'success' | undefined,
		message: string,
	) {
		setAlertSeverity(status);
		setAlertMessage(message);
	}

	async function dfs(
		start: string | number | undefined,
		end: string | number | undefined,
	) {
		prepareGraph();
		updateAlert;
		updateAlert(
			'success',
			`Starting graph traversal at ${userNode.name} (${userNode.batchShortName})`,
		);
		await sleep(1000);
		fgRef.current.centerAt(userNode.x, userNode.y, 100);
		userNode.color = '#3dc06c';

		let stack: Array<string | number | undefined> = [start];
		let visited = new Set<string | number | undefined>();

		while (stack.length > 0) {
			let id = stack.pop();
			let currNode = recurserNodeMap.get(id)!;
			updateAlert(
				'warning',
				`Visiting ${currNode.name} (${currNode.batchShortName})`,
			);

			await sleep(100);

			currNode.color = 'yellow';
			fgRef.current.centerAt(currNode.x, currNode.y, 2000);

			await sleep(100);

			if (currNode.id === end) {
				currNode.color = '#3dc06c';
				updateAlert(
					'success',
					`Found ${currNode.name} (${currNode.batchShortName})`,
				);
				break;
			}

			if (currNode.id === userNode.id) {
				currNode.color = '#3dc06c';
			}

			await sleep(100);

			if (currNode.profilePath && currNode.id !== userNode.id) {
				currNode.color = 'red';
				updateAlert(
					'error',
					`Marking ${currNode.name} (${currNode.batchShortName}) as visited`,
				);
			} else if (!currNode.profilePath) {
				currNode.color = 'black';
			}
			await sleep(100);

			visited.add(currNode.id);

			let paths = recurserEdgeMap.get(currNode.id)!;
			for (let i = 0; i < paths.length; i++) {
				if (!visited.has(paths[i]!.target.id)) {
					stack.push(paths[i].target.id);
					paths[i].target.color = 'blue';
					paths[i].color = 'yellow';

					updateAlert(
						'info',
						`Marking ${paths[i].target.name} (${paths[i].target.batchShortName}) for later`,
					);
					await sleep(100);
					delete paths[i].color;
					paths[i].target.color = 'grey';
				}
				if (!visited.has(paths[i]!.source.id)) {
					stack.push(paths[i].source.id);
					paths[i].color = 'yellow';
					paths[i].source.color = 'blue';
					updateAlert(
						'info',
						`Marking ${paths[i].source.name} (${paths[i].source.batchShortName}) for later`,
					);
					await sleep(100);
					delete paths[i].color;
					paths[i].source.color = 'grey';
				}
			}
			setGraphData(graphData);
		}

		fgRef.current.zoom(5, 1000);
	}

	const handleRecurserSearchSubmit = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13 && recurserSearchValue) {
			dfs(userNode.id, recurserSearchValue.id);
		}
		console.log(graphData.links);
	};

	return (
		<FuzzySearchContext.Provider
			value={{
				searchResults,
				setSearchResults,
				selectedResults,
				setSelectedResults,
				openDialog,
				setOpenDialog,
			}}
		>
			<Alert variant="filled" severity={alertSeverity}>
				{alertMessage}
			</Alert>
			<div className={classes.root}>
				<FuzzySearchResults />
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
							options={graphData.nodes}
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
		</FuzzySearchContext.Provider>
	);
};
