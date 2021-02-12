import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';
import IconButton from '@material-ui/core/IconButton';
import TwitterIcon from '@material-ui/icons/Twitter';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { GraphNode } from '../../types/GraphObject';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: 400,
			width: 400,
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
	node: GraphNode;
}

export const RecurserCard: React.FC<Props> = (props: Props) => {
	const classes = useStyles();

	const handlePageChange = (url: string | undefined) => {
		return function() {
			if (typeof url === 'string') {
				window.open('http://' + url, '_blank');
			} else {
				// TODO: Alert saying not available!
			}
		};
	};

	const handleEmail = () => {
		let email = props.node.email;
		if (typeof email === 'string') {
			// Alert saying email
		} else {
			// Alert saying no email
		}
	};

	return (
		<Card className={classes.root}>
			<CardHeader
				avatar={
					<Avatar
						aria-label="profilePic"
						className={classes.avatar}
						src={props.node.imagePath}
					>
						RC
					</Avatar>
				}
				title={props.node.name}
				subheader={props.node.batch}
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
					<GitHubIcon onClick={handlePageChange(props.node.github)} />
				</IconButton>
				<IconButton>
					<TwitterIcon onClick={handlePageChange(props.node.twitter)} />
				</IconButton>
				<IconButton>
					<EmailIcon onClick={handleEmail} />
				</IconButton>
				<Button variant="contained" className={classes.expand}>
					Learn more
				</Button>
			</CardActions>
		</Card>
	);
};
