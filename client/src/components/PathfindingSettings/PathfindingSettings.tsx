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

interface Props {}

export const PathfindingSettings: React.FC<Props> = () => {
	const [openDialog, setOpenDialog] = React.useState(false);

	const handleDialogOpen = () => {
		setOpenDialog(true);
	};
	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const [age, setAge] = React.useState<string | number>('');
	const [open, setOpen] = React.useState(false);

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setAge(event.target.value as number);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
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
							<ListItemText primary="Enable animations" />
							<Switch checked={true} />
						</ListItem>
						<ListItem divider>
							<ListItemText primary="Algorithm" />
							<Select
								open={open}
								onClose={handleClose}
								onOpen={handleOpen}
								value={age}
								onChange={handleChange}
							>
								<MenuItem value={10}>
									DFS (<i>unweighted</i>)
								</MenuItem>
								<MenuItem value={20}>
									BFS (<i>unweighted</i>)
								</MenuItem>
								<MenuItem value={30}>
									Djikstra's (<i>weighted</i>)
								</MenuItem>
								<MenuItem value={40}>
									A* Search (<i>weighted</i>)
								</MenuItem>
								<MenuItem value={50}>
									Bellman-Ford (<i>weighted</i>)
								</MenuItem>
							</Select>
						</ListItem>
						<ListItem divider>
							<ListItemText primary="Animation speed" />
							<Slider
								defaultValue={100}
								aria-labelledby="discrete-slider"
								valueLabelDisplay="auto"
								step={25}
								min={0}
								max={250}
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
