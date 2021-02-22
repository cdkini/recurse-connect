import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { FormHelperText, TextField } from '@material-ui/core';
import { FuzzySearchContext } from '../../contexts/FuzzySearchContext/FuzzySearchContext';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import Fuse from 'fuse.js';

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

export const CriteriaSearch: React.FC<Props> = () => {
	const classes = useStyles();
	const { graphData } = React.useContext(NetworkContext);
	const {
		setSearchResults,
		setSelectedResults,
		setOpenDialog,
	} = React.useContext(FuzzySearchContext);

	const [searchCriteria, setSearchCriteria] = React.useState<Array<string>>([]);
	const [searchQuery, setSearchQuery] = React.useState<string>('');

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

	return (
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
							<Checkbox checked={searchCriteria.indexOf(criterion) > -1} />
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
	);
};
