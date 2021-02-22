import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import {
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	Button,
	DialogActions,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { Autocomplete } from '@material-ui/lab';
import { NetworkContext } from '../../contexts/NetworkContext/NetworkContext';
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { RecurserNode } from '../../types/RecurserGraph';

interface Props {
	currNode: RecurserNode;
}

export const NoteIcon: React.FC<Props> = (props: Props) => {
	const { userNode, graphData } = React.useContext(NetworkContext);

	const [openDialog, setOpenDialog] = React.useState<boolean>(false);
	const [title, setTitle] = React.useState<string>('');
	const [selectedDate, setSelectedDate] = React.useState<Date | null>(
		new Date(),
	);
	const [recursers, setRecursers] = React.useState<Array<RecurserNode>>([
		userNode,
		props.currNode,
	]);
	const [tags, setTags] = React.useState<string>('');
	const [content, setContent] = React.useState<string>('');

	const handleDialogOpen = () => {
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleTitleChange = (event: React.ChangeEvent<{ value: string }>) => {
		setTitle(event.target.value);
	};

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
	};

	const handleTagsChange = (event: React.ChangeEvent<{ value: string }>) => {
		setTags(event.target.value);
	};

	const handleContentChange = (event: React.ChangeEvent<{ value: string }>) => {
		setContent(event.target.value);
	};

	return (
		<div>
			<IconButton onClick={handleDialogOpen}>
				<CreateIcon />
			</IconButton>
			<Dialog
				open={openDialog}
				onClose={handleDialogClose}
				aria-labelledby="form-dialog-title"
				fullWidth
				maxWidth={'md'}
			>
				<DialogTitle id="form-dialog-title">Add note</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Title"
						value={title}
						fullWidth
						onChange={handleTitleChange}
					/>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							disableToolbar
							format="MM/dd/yyyy"
							margin="dense"
							label="Date"
							fullWidth
							value={selectedDate}
							onChange={handleDateChange}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}}
						/>
					</MuiPickersUtilsProvider>
					<Autocomplete
						multiple
						options={graphData.nodes}
						onChange={(_event: any, newValue: Array<RecurserNode>) => {
							setRecursers(newValue);
						}}
						getOptionLabel={option =>
							`${option.name} (${option.batchShortName})`
						}
						value={recursers}
						renderInput={params => (
							<TextField {...params} variant="standard" label="Recursers" />
						)}
					/>
					<TextField
						margin="dense"
						label="Tags"
						value={tags}
						onChange={handleTagsChange}
						fullWidth
						multiline
					/>
					<TextField
						margin="dense"
						label="Content"
						value={content}
						onChange={handleContentChange}
						fullWidth
						multiline
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDialogClose} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};
