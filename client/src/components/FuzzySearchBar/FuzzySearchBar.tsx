import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Fuse from 'fuse.js';
import Toolbar from '@material-ui/core/Toolbar';
import { Alert } from '@material-ui/lab';
import { FuzzySearchContext } from '../../contexts/FuzzySearchContext/FuzzySearchContext';
import { FuzzySearchResults } from '../FuzzySearchResults/FuzzySearchResults';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import { RecurserNode } from '../../types/RecurserGraph';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Visualizer, Pathfinder } from '../../utils/graphUtils';
import { RecurserSearch } from '../RecurserSearch/RecurserSearch';
import { CriteriaSearch } from '../CriteriaSearch/CriteriaSearch';
import { PathfindingSettings } from '../PathfindingSettings/PathfindingSettings';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		appBar: {
			background: '#3dc06c',
			width: '100%',
			position: 'fixed',
			bottom: 0,
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
		rightAligned: {
			marginLeft: 'auto',
		},
		alert: {
			width: '100%',
			position: 'relative',
			top: -158, // TODO(cdkini): Yuck let's get this absolute positioning out of here.
		},
	}),
);

interface Props {}

export const FuzzySearchBar: React.FC<Props> = () => {
	const classes = useStyles();
	const { fgRef, userNode, graphData, setGraphData } = React.useContext(
		NetworkContext,
	);

	const [openDialog, setOpenDialog] = React.useState<boolean>(false);
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
	const [openAlert, setOpenAlert] = React.useState<boolean>(false);
	const [alertMessage, setAlertMessage] = React.useState<string>('');
	const [alertSeverity, setAlertSeverity] = React.useState<
		'error' | 'warning' | 'info' | 'success' | undefined
	>(undefined);
	const [animationDelay, setAnimationSpeed] = React.useState<number | number[]>(
		100,
	);
	const [selectedAlgo, setSelectedAlgo] = React.useState<string>('dfs');

	const alerter = new Visualizer(
		fgRef,
		setGraphData,
		setAlertSeverity,
		setAlertMessage,
	);
	const pathfinder = new Pathfinder(userNode, graphData, alerter);

	return (
		<FuzzySearchContext.Provider
			value={{
				searchResults,
				setSearchResults,
				selectedResults,
				setSelectedResults,
				openDialog,
				setOpenDialog,
				recurserSearchValue,
				setRecurserSearchValue,
				recurserInputValue,
				setRecurserInputValue,
				pathfinder,
				openAlert,
				setOpenAlert,
			}}
		>
			<div className={classes.root}>
				{openAlert && (
					<Alert
						className={classes.alert}
						onClose={() => {
							setOpenAlert(false);
						}}
						variant="filled"
						severity={alertSeverity}
					>
						{alertMessage}
					</Alert>
				)}
				<FuzzySearchResults />
				<AppBar className={classes.appBar} position="static">
					<Toolbar>
						<CriteriaSearch />
						<div className={classes.rightAligned}>
							<RecurserSearch
								animationDelay={animationDelay}
								selectedAlgo={selectedAlgo}
							/>
						</div>
						<PathfindingSettings
							animationSpeed={animationDelay}
							setAnimationSpeed={setAnimationSpeed}
							setSelectedAlgo={setSelectedAlgo}
						/>
					</Toolbar>
				</AppBar>
			</div>
		</FuzzySearchContext.Provider>
	);
};
