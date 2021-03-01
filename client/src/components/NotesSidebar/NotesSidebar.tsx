import * as React from 'react';
// import { RecurserNote } from '../../types/RecurserNote';
import {
	makeStyles,
	createStyles,
	Theme,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Divider,
} from '@material-ui/core';
import List from '@material-ui/core/List';

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
			backgroundColor: '#29487d',
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
			width: '100%',
			margin: '0px',
			height: '35px',
			outline: 'none',
			border: 'none',
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
	}),
);

interface Props {}

export const NotesSidebar: React.FC<Props> = () => {
	const classes = useStyles();

	return (
		<List dense className={classes.root}>
			{[0, 1, 2, 3].map(value => {
				const labelId = `checkbox-list-secondary-label-${value}`;
				return (
					<div>
						<ListItem key={value} button>
							<ListItemAvatar>
								<Avatar
									alt={`Avatar n°${value + 1}`}
									src={`/static/images/avatar/${value + 1}.jpg`}
								/>
							</ListItemAvatar>
							<ListItemText
								id={labelId}
								primary={`Line item ${value + 1}`}
								secondary={'January 1, 1996'}
							/>
						</ListItem>
						<Divider component="li" />
					</div>
				);
			})}
		</List>
	);
};
