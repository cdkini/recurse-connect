import * as React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Slider,
	Switch,
	Divider,
	List,
	ListItem,
	ListItemText,
	Select,
	MenuItem,
} from '@material-ui/core';
import { IconButton } from '@material-ui/core';
// import {AlgoArgs} from '../../utils/graphUtils';
// import { FuzzySearchContext } from '../../contexts/FuzzySearchContext/FuzzySearchContext';

interface Props {}

export const PathfindingSettings: React.FC<Props> = () => {
	// const {pathfinder} = React.useContext(FuzzySearchContext);

	const [openDialog, setOpenDialog] = React.useState(false);
	const [age, setAge] = React.useState<number>(30);
	const [openSelect, setOpenSelect] = React.useState(false);
	const [animationSwitchChecked, setAnimationSwitchChecked] = React.useState(
		true,
	);
	const [nodeColorSwitchChecked, setNodeColorSwitchChecked] = React.useState(
		false,
	);
	const [animationSpeed, setAnimationSpeed] = React.useState<number | number[]>(
		100,
	);

	const handleDialogOpen = () => {
		setOpenDialog(true);
	};
	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setAge(event.target.value as number);
	};

	const handleSelectClose = () => {
		setOpenSelect(false);
	};

	const handleSelectOpen = () => {
		setOpenSelect(true);
	};

	const handleAnimationsSwitchClick = () => {
		setAnimationSwitchChecked(!animationSwitchChecked);
	};

	const handleNodeColorSwitchClick = () => {
		setNodeColorSwitchChecked(!nodeColorSwitchChecked);
	};

	const handleSliderChange = (_event: any, newValue: number | number[]) => {
		setAnimationSpeed(newValue);
	};

	return (
		<div>
			<IconButton onClick={handleDialogOpen}>
				<SettingsIcon fontSize="large" style={{ color: '#000000' }} />
			</IconButton>
			<Dialog
				open={openDialog}
				onClose={handleDialogClose}
				fullWidth={true}
				maxWidth={'sm'}
			>
				<DialogTitle id="form-dialog-title">Pathfinding Settings</DialogTitle>
				<Divider />
				<DialogContent>
					<List component="nav" aria-label="mailbox folders">
						<ListItem divider>
							<ListItemText
								primary="Enable animations"
								secondary="Toggle node/edge highlighting and dynamic camera movement"
							/>
							<Switch
								checked={animationSwitchChecked}
								onClick={handleAnimationsSwitchClick}
							/>
						</ListItem>
						<ListItem divider>
							<ListItemText
								primary="Enable status bar"
								secondary="Toggle updates about pathfinding state (marks, visits, etc)"
							/>
							<Switch
								checked={animationSwitchChecked}
								onClick={handleAnimationsSwitchClick}
							/>
						</ListItem>
						<ListItem divider>
							<ListItemText
								primary="Enable color grouping"
								secondary="Toggle between unique or shared color between batchmates"
							/>
							<Switch
								checked={nodeColorSwitchChecked}
								onClick={handleNodeColorSwitchClick}
							/>
						</ListItem>
						<ListItem divider>
							<ListItemText
								primary="Pathfinder"
								secondary="Determines algorithm and treatment of graph edges"
							/>
							<Select
								open={openSelect}
								onClose={handleSelectClose}
								onOpen={handleSelectOpen}
								value={age}
								onChange={handleSelectChange}
							>
								<MenuItem value={10}>DFS (unweighted)</MenuItem>
								<MenuItem value={20}>BFS (unweighted)</MenuItem>
								<MenuItem value={30}>Djikstra's (weighted)</MenuItem>
								<MenuItem value={40}>A* Search (weighted)</MenuItem>
							</Select>
						</ListItem>
						<ListItem divider>
							<ListItemText
								primary="Animation speed"
								secondary="Determine delay between pathfinding states"
							/>
							<Slider
								aria-labelledby="discrete-slider"
								valueLabelDisplay="auto"
								onChange={handleSliderChange}
								step={25}
								min={0}
								max={250}
								value={animationSpeed}
							/>
						</ListItem>
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDialogClose} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
