import * as React from 'react';
import './Notes.css';
import { NotesSidebar } from '../../components/NotesSidebar/NotesSidebar';
import { NotesEditor } from '../../components/NotesEditor/NotesEditor';
import { RecurserNote } from '../../types/RecurserNote';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { makeStyles, Theme, createStyles, Toolbar } from '@material-ui/core';
import { RecurserNode } from '../../types/RecurserGraph';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		content: {
			toolbar: theme.mixins.toolbar,
		},
		shiftTextRight: {
			marginLeft: 385,
		},
	}),
);

interface Props {
	profileId: number;
}

export const Notes: React.FC<Props> = (props: Props) => {
	const classes = useStyles();

	const [profiles, setProfiles] = React.useState<Array<RecurserNode>>([]);

	React.useEffect(() => {
		fetch('/api/v1/graph/' + props.profileId.toString())
			.then(res => res.json())
			.then(data => {
				setProfiles(data.nodes);
			});
	}, []);

	const [notes, setNotes] = React.useState<Array<RecurserNote>>([]);

	React.useEffect(() => {
		fetch('/api/v1/notes/' + props.profileId.toString())
			.then(res => res.json())
			.then(data => {
				setNotes(Object.values(data.notes));
			});
	}, []);

	const [focusedNote, setFocusedNote] = React.useState<RecurserNote | null>(
		null,
	);

	const profileId = props.profileId;

	return (
		<div>
			<NavigationBar />
			<div className={classes.content}>
				<Toolbar></Toolbar>
				<NotesSidebar
					profileId={profileId}
					notes={notes}
					profiles={profiles}
					focusedNote={focusedNote}
					setFocusedNote={setFocusedNote}
				/>
				<div className={classes.shiftTextRight}>
					{focusedNote ? (
						<NotesEditor
							profileId={profileId}
							profiles={profiles}
							focusedNote={focusedNote}
						/>
					) : (
						<div></div>
					)}
				</div>
			</div>
		</div>
	);
};
