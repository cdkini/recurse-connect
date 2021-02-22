import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Fuse from 'fuse.js';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Toolbar from '@material-ui/core/Toolbar';
import { Alert } from '@material-ui/lab';
import { FuzzySearchContext } from '../../contexts/FuzzySearchContext/FuzzySearchContext';
import { FuzzySearchResults } from '../FuzzySearchResults/FuzzySearchResults';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import { RecurserNode } from '../../types/RecurserGraph';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Alerter, Pathfinder } from '../../utils/graphUtils';
import { RecurserSearch } from '../RecurserSearch/RecurserSearch';
import { CriteriaSearch } from '../CriteriaSearch/CriteriaSearch';

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
		alert: {},
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
	const [alertMessage, setAlertMessage] = React.useState('');
	const [alertSeverity, setAlertSeverity] = React.useState<
		'error' | 'warning' | 'info' | 'success' | undefined
	>(undefined);

	const alerter = new Alerter(setAlertSeverity, setAlertMessage);
	const pathfinder = new Pathfinder(
		fgRef,
		userNode,
		graphData,
		setGraphData,
		alerter,
	);

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
			}}
		>
			<Alert
				className={classes.alert}
				variant="filled"
				severity={alertSeverity}
			>
				{alertMessage}
			</Alert>
			<div className={classes.root}>
				<FuzzySearchResults />
				<AppBar className={classes.appBar} position="static">
					<Toolbar>
						<CriteriaSearch />
						<RecurserSearch />
						<IconButton>
							<SettingsIcon fontSize="large" style={{ color: '#000000' }} />
						</IconButton>
					</Toolbar>
				</AppBar>
			</div>
		</FuzzySearchContext.Provider>
	);
};
