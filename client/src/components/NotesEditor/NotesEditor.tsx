import * as React from 'react';
// import BorderColorIcon from '@material-ui/icons/BorderColor';
// import debounce from '../../utils/noteUtils';
// import { RecurserNote } from '../../types/RecurserNote';
import {
	makeStyles,
	createStyles,
	Theme,
	TextField,
	Button,
} from '@material-ui/core';
import { MarkdownField } from '../MarkdownField/MarkdownField';
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';

import { Paper, Grid, CssBaseline } from '@material-ui/core';

import { Node } from 'slate';
import { NotesContext } from '../../contexts/NotesContext/NotesContext';
import { RecurserNode } from '../../types/RecurserGraph';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.background.paper,
			height: 'calc(100% - 35px)',
			position: 'absolute',
			left: '0',
			width: '300px',
			boxShadow: '0px 0px 2px black',
		},
		titleInput: {
			height: '50px',
			boxSizing: 'border-box',
			border: 'none',
			padding: '5px',
			fontSize: '24px',
			width: 'calc(100% - 300px)',
			backgroundColor: '#29487d',
			color: 'white',
			paddingLeft: '50px',
		},
		editIcon: {
			position: 'absolute',
			left: '310px',
			top: '12px',
			color: 'white',
			width: '10',
			height: '10',
		},
		editorContainer: {
			// height: '100%',
			// boxSizing: 'border-box'
		},
		button: {
			margin: theme.spacing(1),
		},
	}),
);

const initialContent = [
	{
		type: 'heading-two',
		children: [{ text: 'Start documenting your time at RC!' }],
	},
	{
		type: 'paragraph',
		children: [
			{
				text: 'The editor supports Markdown! Try starting a new line with:',
			},
			{
				text: '\n    - # for headers',
			},
			{
				text: '\n    - > for a block quote',
			},
			{
				text: '\n    - *, +, or - for lists',
			},
		],
	},
];

interface Props {}

export const NotesEditor: React.FC<Props> = () => {
	const classes = useStyles();
	const { profileId, graphData } = React.useContext(NotesContext);
	const [recursers, setRecursers] = React.useState<Array<RecurserNode>>([]);

	const [title, setTitle] = React.useState<string>('My new note!');
	const [selectedDate, setSelectedDate] = React.useState<Date | null>(
		new Date(),
	);

	const [tags, setTags] = React.useState<string>('');
	const [content, setContent] = React.useState<Node[]>(initialContent);

	const handleTitleChange = (event: React.ChangeEvent<{ value: string }>) => {
		setTitle(event.target.value);
	};

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
	};

	const handleTagsChange = (event: React.ChangeEvent<{ value: string }>) => {
		setTags(event.target.value);
	};

	const handleSaveClick = () => {
		let body = {
			author: profileId,
			title: title,
			date: selectedDate,
			participants: recursers.map(r => r.id),
			tags: tags.split(', ').map(t => t.trim()),
			content: content,
		};
		console.log(body);
		fetch('http://localhost:5000/api/v1/notes', {
			method: 'POST', // or 'PUT'
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'no-cors',
			body: JSON.stringify(body),
		});
	};

	const handleDeleteClick = () => {};

	return (
		<div style={{ padding: 16, margin: 'auto', maxWidth: 1500 }}>
			<CssBaseline />
			<Paper style={{ padding: 16 }}>
				<Grid container alignItems="flex-start" spacing={2}>
					<Grid item xs={8}>
						<TextField
							autoFocus
							fullWidth
							type="heading"
							label="Title"
							margin="dense"
							defaultValue="My new note!"
							onChange={handleTitleChange}
						/>
					</Grid>
					<Grid item xs={4}>
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
					</Grid>
					<Grid item xs={12}>
						<Autocomplete
							multiple
							options={graphData.nodes}
							onChange={(_event: any, newValue: Array<RecurserNode>) => {
								setRecursers(newValue);
							}}
							getOptionLabel={option =>
								option.profilePath
									? `${option.name} (${option.batchShortName})`
									: `${option.name}`
							}
							value={recursers}
							renderInput={params => (
								<TextField {...params} variant="standard" label="Recursers" />
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							multiline
							label="Tags"
							onChange={handleTagsChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<br />
						<MarkdownField content={content} setContent={setContent} />
					</Grid>
					<Grid container xs={12} justify="flex-end">
						<Button
							variant="contained"
							color="primary"
							size="small"
							className={classes.button}
							startIcon={<DeleteIcon />}
							style={{
								backgroundColor: '#e50000',
							}}
							onClick={handleDeleteClick}
						>
							Delete
						</Button>
						<Button
							variant="contained"
							color="primary"
							size="small"
							className={classes.button}
							startIcon={<SaveIcon />}
							style={{
								backgroundColor: '#0080ff',
							}}
							onClick={handleSaveClick}
						>
							Save
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</div>
	);
};
