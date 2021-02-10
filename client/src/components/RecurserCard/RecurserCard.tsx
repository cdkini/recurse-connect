import * as React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import EmailIcon from '@material-ui/icons/Email';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: 345,
		},
		media: {
			height: 0,
			paddingTop: '56.25%', // 16:9
		},
		expand: {
			transform: 'rotate(0deg)',
			marginLeft: 'auto',
			transition: theme.transitions.create('transform', {
				duration: theme.transitions.duration.shortest,
			}),
		},
		avatar: {
			width: theme.spacing(7),
			height: theme.spacing(7),
		},
	}),
);

interface Props {
	profileID: number;
}

export const RecurserCard: React.FC<Props> = ({ profileID }): JSX.Element => {
	const [userData, setUserData] = React.useState({});
	React.useEffect(() => {
		fetch('/api/v1/users/' + profileID.toString())
			.then(res => res.json())
			.then(data => {
				setUserData(data);
			});
	}, []);
	console.log(userData);

	const classes = useStyles();

	return (
		<Card className={classes.root}>
			<CardHeader
				avatar={
					<Avatar
						aria-label="recipe"
						className={classes.avatar}
						src="https://assets.recurse.com/rails/active_storage/representations/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYzQ9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--73e1a6bd523e701f4c4c92f06b33d99636886370/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCam9MY21WemFYcGxTU0lNTVRVd2VERTFNQVk2QmtWVSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--d8f54fe211cbe3254ece86a55c83c4d5b374eaab/IMG-2975.jpg"
					>
						R
					</Avatar>
				}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title="Chetan Kini"
				subheader="Winter 2, 2021"
			/>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					Interests: Python
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					Text goes here!
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					Text goes here!
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<IconButton>
					<GitHubIcon />
				</IconButton>
				<IconButton>
					<TwitterIcon />
				</IconButton>
				<IconButton>
					<EmailIcon />
				</IconButton>
				<Button variant="contained" className={classes.expand}>
					Learn more
				</Button>
			</CardActions>
		</Card>
	);
};
