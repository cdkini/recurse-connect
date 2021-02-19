import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Fuse from 'fuse.js';
import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormHelperText,
	List,
	ListItem,
	Switch,
	TextField,
	Theme,
	Typography,
	createStyles,
	makeStyles,
} from '@material-ui/core';
import { RecurserNode, RecurserGraph } from '../../types/RecurserGraph';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
			maxWidth: 300,
		},
		dialog: {
			margin: 0,
			padding: theme.spacing(2),
		},
		avatar: {
			width: theme.spacing(7),
			height: theme.spacing(7),
		},
	}),
);

interface Props {
	graphData: RecurserGraph;
	setGraphData: React.Dispatch<React.SetStateAction<RecurserGraph>>;
	currNode: RecurserNode;
	setCurrNode: (node: RecurserNode) => void;
	fgRef: any;
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

export const FuzzySearchResults: React.FC<Props> = props => {
	const classes = useStyles();

	const [threshold, setThreshold] = React.useState<number>(0);
	const [resultCap, setResultCap] = React.useState<number>(0);

	const handleDialogClose = () => {
		props.setSearchResults([]);
		props.setSelectedResults(new Set<Fuse.FuseResult<RecurserNode>>());
		setThreshold(0);
		setResultCap(0);
		props.setOpenDialog(false);
	};

	const handlePageChange = (url: string | undefined) => {
		return function() {
			if (typeof url === 'string') {
				window.open('http://' + url, '_blank');
			}
		};
	};

	const handleSwitchState = (result: Fuse.FuseResult<RecurserNode>) => {
		return props.selectedResults.has(result);
	};

	const handleSwitchToggle = (result: Fuse.FuseResult<RecurserNode>) => {
		return function() {
			let newResultNodes = new Set<Fuse.FuseResult<RecurserNode>>(
				props.selectedResults,
			);
			if (props.selectedResults.has(result)) {
				newResultNodes.delete(result);
			} else {
				newResultNodes.add(result);
			}
			props.setSelectedResults(newResultNodes);
		};
	};

	const handleVisualizeButtonClick = () => {
		let newGraphData = { ...props.graphData };
		let selectedNodes = new Set<RecurserNode>();
		props.selectedResults.forEach(res => selectedNodes.add(res.item));

		for (let i = 0; i < newGraphData.nodes.length; i++) {
			let currNode = newGraphData.nodes[i];
			if (selectedNodes.has(currNode)) {
				newGraphData.nodes[i].color = '#3dc06c';
			} else {
				newGraphData.nodes[i].color = '#000000';
			}
		}

		props.setGraphData(newGraphData);
		props.setOpenDialog(false);
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
			for (let i = 0; i < props.searchResults.length; i++) {
				let resultScore = props.searchResults[i].score;
				if (resultScore && Math.floor(100 * (1 - resultScore)) < threshold) {
					break;
				}
				newSelectedResults.add(props.searchResults[i]);
			}
			props.setSelectedResults(newSelectedResults);
		}
	};

	const handleResultCapChange = (
		event: React.ChangeEvent<{ value: string }>,
	) => {
		let conversion = parseInt(event.target.value);
		if (
			!conversion ||
			!(conversion >= 0 && conversion <= props.searchResults.length)
		) {
			return; // TODO: Change up the error message and disable!
		}
		setResultCap(conversion);
	};

	const handleResultCapSubmit = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13) {
			let newSelectedResults = new Set<Fuse.FuseResult<RecurserNode>>();
			for (let i = 0; i < resultCap; i++) {
				newSelectedResults.add(props.searchResults[i]);
			}
			props.setSelectedResults(newSelectedResults);
		}
	};

	const listSearchResults = () => {
		let stringifyScore = (score: number) => {
			let val = Math.floor(100 * (1 - score));
			return <i> {val}% similarity</i>;
		};

		return props.searchResults.map(res => (
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
		<Dialog
			className={classes.dialog}
			onClose={handleDialogClose}
			open={props.openDialog}
			fullWidth={true}
			maxWidth={'sm'}
		>
			<DialogTitle id="customized-dialog-title">Search Results</DialogTitle>
			<DialogContent>
				<div>
					You've currently selected <b>{props.selectedResults.size}</b> of{' '}
					<b>{props.searchResults.length}</b> possible results.
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
						defaultValue={0}
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
						defaultValue={props.searchResults.length}
					/>
					<FormHelperText>
						<i>Set number of results (Enter to submit)</i>
					</FormHelperText>
				</FormControl>
				<List>
					{props.searchResults.length > 0
						? listSearchResults()
						: 'No results found; please check your input criteria and query.'}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleVisualizeButtonClick}>Visualize</Button>
			</DialogActions>
		</Dialog>
	);
};
