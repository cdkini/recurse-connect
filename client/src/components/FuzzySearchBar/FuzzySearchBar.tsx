import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
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
import {
	FormHelperText,
	TextField,
	Dialog,
	Avatar,
	ListItem,
	List,
	Switch,
	Button,
	DialogActions,
	DialogTitle,
	Typography,
	DialogContent,
} from '@material-ui/core';
import { RecurserGraph, RecurserNode } from '../../types/RecurserGraph';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
		dialog: {
			margin: 0,
			padding: theme.spacing(2),
		},
		avatar: {
			width: theme.spacing(7),
			height: theme.spacing(7),
		},
		closeButton: {
			position: 'absolute',
			right: theme.spacing(1),
			top: theme.spacing(1),
			color: theme.palette.grey[500],
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
	const [threshold, setThreshold] = React.useState<number>(0);
	const [resultCap, setResultCap] = React.useState<number>(0);

	const fuse = React.useMemo(() => {
		return new Fuse(props.graphData.nodes, {
			includeScore: true,
			keys: searchCriteria,
		});
	}, [searchCriteria]);

	const handleDialogOpen = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13) {
			setSearchResults(fuse.search(searchQuery));
			setOpenDialog(true);
		}
	};

	const handleDialogClose = () => {
		setSearchResults([]);
		setSelectedResults(new Set<Fuse.FuseResult<RecurserNode>>());
		setThreshold(0);
		setResultCap(0);
		setOpenDialog(false);
	};

	const handleCriteriaChange = (
		event: React.ChangeEvent<{ value: unknown }>,
	) => {
		setSearchCriteria(event.target.value as string[]);
	};

	const handleQueryChange = (event: React.ChangeEvent<{ value: string }>) => {
		setSearchQuery(event.target.value);
	};

	const handlePageChange = (url: string | undefined) => {
		return function() {
			if (typeof url === 'string') {
				window.open('http://' + url, '_blank');
			}
		};
	};

	const handleSwitchState = (result: Fuse.FuseResult<RecurserNode>) => {
		return selectedResults.has(result);
	};

	const handleSwitchToggle = (result: Fuse.FuseResult<RecurserNode>) => {
		return function() {
			let newResultNodes = new Set<Fuse.FuseResult<RecurserNode>>(
				selectedResults,
			);
			if (selectedResults.has(result)) {
				newResultNodes.delete(result);
			} else {
				newResultNodes.add(result);
			}
			setSelectedResults(newResultNodes);
		};
	};

	const handleVisualizeButtonClick = () => {
		let newGraphData = { ...props.graphData };
		let selectedNodes = new Set<RecurserNode>();
		selectedResults.forEach(res => selectedNodes.add(res.item));

		for (let i = 0; i < newGraphData.nodes.length; i++) {
			let currNode = newGraphData.nodes[i];
			if (selectedNodes.has(currNode)) {
				newGraphData.nodes[i].color = '#3dc06c';
			} else {
				newGraphData.nodes[i].color = '#000000';
			}
		}

		props.setGraphData(newGraphData);
		setOpenDialog(false);
	};

	const handleThresholdChange = (
		event: React.ChangeEvent<{ value: string }>,
	) => {
		let conversion = parseInt(event.target.value);
		if (!conversion || !(conversion >= 0 && conversion <= 100)) {
			return; // TODO: Change up the error message and disable!
		}
		setThreshold(conversion);
	};

	const handleThresholdSubmit = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13) {
			let newSelectedResults = new Set<Fuse.FuseResult<RecurserNode>>();
			for (let i = 0; i < searchResults.length; i++) {
				let resultScore = searchResults[i].score;
				if (resultScore && Math.floor(100 * (1 - resultScore)) < threshold) {
					break;
				}
				newSelectedResults.add(searchResults[i]);
			}
			setSelectedResults(newSelectedResults);
		}
	};

	const handleResultCapChange = (
		event: React.ChangeEvent<{ value: string }>,
	) => {
		let conversion = parseInt(event.target.value);
		if (
			!conversion ||
			!(conversion >= 0 && conversion <= searchResults.length)
		) {
			return; // TODO: Change up the error message and disable!
		}
		setResultCap(conversion);
	};

	const handleResultCapSubmit = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13) {
			let newSelectedResults = new Set<Fuse.FuseResult<RecurserNode>>();
			for (let i = 0; i < resultCap; i++) {
				newSelectedResults.add(searchResults[i]);
			}
			setSelectedResults(newSelectedResults);
		}
	};

	const listSearchResults = () => {
		let stringifyScore = (score: number) => {
			let val = Math.floor(100 * (1 - score));
			return <i> {val}% similarity</i>;
		};

		return searchResults.map(res => (
			<ListItem divider={true} key={res.item.id}>
				<Switch
					checked={handleSwitchState(res)}
					onClick={handleSwitchToggle(res)}
				/>
				<Avatar
					className={classes.avatar}
					src={res.item.imagePath}
					onClick={handlePageChange(res.item.profilePath)}
				/>
				<Typography>
					{res.item.name} ({res.item.batchShortName}) |{' '}
					{res.score ? stringifyScore(res.score) : null}
				</Typography>
			</ListItem>
		));
	};

	return (
		<div className={classes.root}>
			<Dialog
				className={classes.dialog}
				onClose={handleDialogClose}
				open={openDialog}
				fullWidth={true}
				maxWidth={'sm'}
			>
				<DialogTitle id="customized-dialog-title">Search Results</DialogTitle>
				<DialogContent>
					<div>
						You've currently selected <b>{selectedResults.size}</b> of{' '}
						<b>{searchResults.length}</b> possible results.
						<br />
						If you'd like to change this, please filter or manually switch
						connections below.
						<br />
					</div>
					<FormControl className={classes.formControl}>
						<TextField
							onChange={handleThresholdChange}
							onKeyDown={handleThresholdSubmit}
							label="Set similarity threshold "
						/>
						<FormHelperText>
							<i>Set minimum threshold (Enter to submit)</i>
						</FormHelperText>
					</FormControl>
					<FormControl className={classes.formControl}>
						<TextField
							onChange={handleResultCapChange}
							onKeyDown={handleResultCapSubmit}
							label="Set result cap"
						/>
						<FormHelperText>
							<i>Set number of results (Enter to submit)</i>
						</FormHelperText>
					</FormControl>
					<List>
						{searchResults.length > 0
							? listSearchResults()
							: 'No results found; please check your input criteria and query.'}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleVisualizeButtonClick}>Visualize</Button>
				</DialogActions>
			</Dialog>
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
				</Toolbar>
			</AppBar>
		</div>
	);
};
