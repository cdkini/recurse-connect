import * as React from 'react';
import {
	makeStyles,
	createStyles,
	Theme,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Divider,
	Typography,
	TextField,
	Button,
} from '@material-ui/core';
import List from '@material-ui/core/List';
import { RecurserNote } from '../../types/RecurserNote';
import { RecurserNode } from '../../types/RecurserGraph';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.background.paper,
			height: 'calc(100%)',
			position: 'absolute',
			left: '0',
			width: '20%',
			boxShadow: '0px 0px 2px black',
		},
		newChatBtn: {
			borderRadius: '0px',
		},
		unreadMessage: {
			color: 'red',
			position: 'absolute',
			top: '0',
			right: '5px',
		},
		newNoteBtn: {
			width: '100%',
			height: '35px',
			borderBottom: '1px solid black',
			borderRadius: '0px',
			backgroundColor: '#000000',
			color: 'white',
			'&:hover': {
				backgroundColor: '#88a2ce',
			},
		},
		sidebarContainer: {
			marginTop: '0px',
			width: '300px',
			height: '100%',
			boxSizing: 'border-box',
			float: 'left',
			overflowY: 'scroll',
			overflowX: 'hidden',
		},
		newNoteInput: {
			width: '80%',
			left: theme.spacing(2),
			paddingLeft: '5px',
			'&:focus': {
				outline: '2px solid rgba(81, 203, 238, 1)',
			},
		},
		newNoteSubmitBtn: {
			width: '100%',
			backgroundColor: '#28787c',
			borderRadius: '0px',
			color: 'white',
		},
		fab: {
			margin: theme.spacing(1),
			left: theme.spacing(1),
		},
	}),
);

interface Props {
	profileId: number;
	notes: Array<RecurserNote>;
	profiles: Array<RecurserNode>;
	focusedNote: RecurserNote | null;
	setFocusedNote: React.Dispatch<React.SetStateAction<RecurserNote | null>>;
}

export const NotesSidebar: React.FC<Props> = (props: Props) => {
	const classes = useStyles();

	function getImagePath(note: RecurserNote) {
		if (note.participants) {
			let id =
				note.participants[Math.floor(Math.random() * note.participants.length)];
			for (let profile of props.profiles) {
				if (profile.id === id) {
					return profile.imagePath;
				}
			}
		}
		return 'https://d29xw0ra2h4o4u.cloudfront.net/assets/logo_square-051508b5ecf8868635aea567bb86f423f4d1786776e5dfce4adf2bc7edf05804.png';
	}

	const handleNoteClick = (note: RecurserNote) => {
		props.setFocusedNote(note);
	};

	return (
		<div>
			<List dense className={classes.root}>
				<Button className={classes.newNoteBtn}>New Note</Button>
				<TextField
					className={classes.newNoteInput}
					label="Find notes by tag"
				></TextField>
				{props.notes.map(note => {
					const labelId = `checkbox-list-secondary-label-${note}`;
					return (
						<div>
							<ListItem
								key={note.id}
								onClick={() => handleNoteClick(note)}
								button
							>
								<ListItemAvatar>
									<Avatar alt={'R'} src={getImagePath(note)} />
								</ListItemAvatar>
								<ListItemText
									id={labelId}
									primary={`${note.title}`}
									secondary={note.date.toLocaleString().substring(0, 16)}
								/>
								<Typography variant="caption">
									<i>{note.tags}</i>
								</Typography>
							</ListItem>
							<Divider component="li" />
						</div>
					);
				})}
			</List>
		</div>
	);
};
