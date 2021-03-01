import * as React from 'react';
import './Notes.css';
import { NotesSidebar } from '../../components/NotesSidebar/NotesSidebar';
import { NotesEditor } from '../../components/NotesEditor/NotesEditor';
import { RecurserNote } from '../../types/RecurserNote';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { makeStyles, Theme, createStyles, Toolbar } from '@material-ui/core';
import { RecurserGraph } from '../../types/RecurserGraph';
import { NotesContext } from '../../contexts/NotesContext/NotesContext';

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

	const [graphData, setGraphData] = React.useState<RecurserGraph>({
		nodes: [],
		links: [],
	});

	React.useEffect(() => {
		fetch('/api/v1/graph/' + props.profileId.toString())
			.then(res => res.json())
			.then(data => {
				setGraphData(data);
			});
	}, []);

	const [notes, setNotes] = React.useState<Array<RecurserNote>>([]);

	React.useEffect(() => {
		fetch('/api/v1/notes/' + props.profileId.toString())
			.then(res => res.json())
			.then(data => {
				setNotes(data);
			});
	}, []);

	const profileId = props.profileId;

	return (
		<NotesContext.Provider
			value={{
				profileId,
				graphData,
				notes,
			}}
		>
			<NavigationBar />
			<div className={classes.content}>
				<Toolbar></Toolbar>
				<NotesSidebar></NotesSidebar>
				<div className={classes.shiftTextRight}>
					<NotesEditor />
				</div>
			</div>
		</NotesContext.Provider>
	);
};
