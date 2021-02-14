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
import NavigationIcon from '@material-ui/icons/Navigation';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import { FormHelperText, TextField, Dialog, Fab } from '@material-ui/core';
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
	'Name',
	'Location',
	'Company',
	'Interests',
	'Batch',
	'Bio',
	'Before RC',
	'During RC',
];

interface Props {
	graphData: RecurserGraph;
}

export const FuzzySearchBar: React.FC<Props> = props => {
	const classes = useStyles();

	const [criteriaName, setCriteriaName] = React.useState<string[]>([]);
	const [options, setOptions] = React.useState<Object>({});
	const [open, setOpen] = React.useState<boolean>(false);

	const [value, setValue] = React.useState<RecurserNode | null | undefined>(
		{} as RecurserNode,
	);
	const [inputValue, setInputValue] = React.useState('None');

	const handleCriteriaChange = (
		event: React.ChangeEvent<{ value: unknown }>,
	) => {
		setCriteriaName(event.target.value as string[]);
	};

	const handleDialogOpen = () => {
		setOpen(true);
	};

	const handleDialogClose = () => {
		setOpen(false);
		updateOptions([]);
	};

	const updateOptions = (keys: Array<string>) => {
		setOptions({
			includeScore: true,
			shouldSort: true,
			findAllMatches: true,
			keys: keys,
		});
	};

	const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.keyCode === 13 && value) {
			alert(value.name);
		}
	};

	const fuse = new Fuse(props.graphData.nodes, options);
	console.log(fuse.search('Python'));

	return (
		<div className={classes.root}>
			<Dialog onClose={handleDialogClose} open={open}></Dialog>
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
								value={criteriaName}
								onChange={handleCriteriaChange}
								input={<Input />}
								renderValue={selected => (selected as string[]).join(', ')}
								MenuProps={MenuProps}
							>
								{criteria.map(criterion => (
									<MenuItem key={criterion} value={criterion}>
										<Checkbox checked={criteriaName.indexOf(criterion) > -1} />
										<ListItemText primary={criterion} />
									</MenuItem>
								))}
							</Select>
							<FormHelperText>What to search for</FormHelperText>
						</FormControl>
						<FormControl className={classes.formControl}>
							<TextField label="Query" />
							<FormHelperText>Your search query</FormHelperText>
						</FormControl>
						<Fab variant="extended" onClick={handleDialogOpen}>
							<NavigationIcon className={classes.extendedIcon} />
							Connect
						</Fab>
						<Autocomplete
							value={value}
							onChange={(
								_event: any,
								newValue: RecurserNode | null | undefined,
							) => {
								console.log(newValue);
								setValue(newValue);
							}}
							inputValue={inputValue}
							onInputChange={(_event, newInputValue) => {
								setInputValue(newInputValue);
							}}
							id="controllable-states-demo"
							options={props.graphData.nodes.filter(
								node => typeof node.id === 'number',
							)}
							getOptionLabel={(node: RecurserNode) =>
								node.batchShortName
									? `${node.name} (${node.batchShortName})`
									: "Brian Kernighan (W2'96)"
							}
							style={{ width: 300 }}
							renderInput={params => (
								<TextField
									{...params}
									label="Search by name"
									variant="outlined"
								/>
							)}
							onKeyDown={handleEnter}
						/>
					</IconButton>
				</Toolbar>
			</AppBar>
		</div>
	);
};
