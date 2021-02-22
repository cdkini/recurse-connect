import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import LabelIcon from '@material-ui/icons/Label';
import {
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	Button,
	DialogActions,
} from '@material-ui/core';

interface Props {}

export const TagIcon: React.FC<Props> = () => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<IconButton onClick={handleClickOpen}>
				<LabelIcon />
			</IconButton>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Add tags</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Recurse Connect uses a system of tags to improve search results over
						time. If you've interacted with this participant, feel free to add
						some! Tags can be about interests, hobbies, events, reading groups,
						and more!
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Please write Recurser tags below (separate by commas if multiple)"
						type="email"
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleClose} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
