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
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import { RecurserNode } from '../../types/RecurserGraph';

interface Props {
	currNode: RecurserNode;
}

export const TagIcon: React.FC<Props> = (props: Props) => {
	const { profileId } = React.useContext(NetworkContext);
	const [open, setOpen] = React.useState(false);
	const [tags, setTags] = React.useState('');

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleTagsChange = (event: React.ChangeEvent<{ value: string }>) => {
		setTags(event.target.value);
	};

	const handleSubmitClick = () => {
		let items = [];
		let arr = tags.split(', ').map(t => t.trim());
		for (let i = 0; i < arr.length; i++) {
			items.push({
				author: profileId,
				participants: [props.currNode.id],
				name: arr[i],
			});
		}

		let body = {
			tags: items,
		};

		fetch('/api/v1/tags', {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'no-cors',
			body: JSON.stringify(body),
		});

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
						onChange={handleTagsChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmitClick} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
