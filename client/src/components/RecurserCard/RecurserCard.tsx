import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import EmailIcon from '@material-ui/icons/Email';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { GraphNode } from '../../types/GraphObject';
import { SocialMediaIcon } from '../SocialMediaIcon/SocialMediaIcon';

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
		popover: {
			pointerEvents: 'none',
		},
		paper: {
			padding: theme.spacing(1),
		},
	}),
);

interface Props {
	node: GraphNode;
}

export const RecurserCard: React.FC<Props> = (props: Props) => {
	const classes = useStyles();

	const containsContent = (content: string | undefined) => {
		return typeof content === 'string' && content.length > 0;
	};

	const handlePageChange = (url: string | undefined) => {
		return function() {
			if (typeof url === 'string') {
				window.open('http://' + url, '_blank');
			}
		};
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
				subheader={props.node.batchName}
			/>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="p">
					Interests: {props.node.interests}
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					During RC: {props.node.duringRc}
				</Typography>
				<Typography variant="body2" color="textSecondary" component="p">
					Text goes here!
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<SocialMediaIcon
					contents={props.node.github}
					icon={<GitHubIcon />}
					isEmpty={!containsContent(props.node.github)}
					isClickable={containsContent(props.node.github)}
					handlePageChange={handlePageChange}
				/>
				<SocialMediaIcon
					contents={props.node.twitter}
					icon={<TwitterIcon />}
					isEmpty={!containsContent(props.node.twitter)}
					isClickable={containsContent(props.node.twitter)}
					handlePageChange={handlePageChange}
				/>
				<SocialMediaIcon
					contents={props.node.email}
					icon={<EmailIcon />}
					isEmpty={!containsContent(props.node.email)}
					isClickable={false}
					handlePageChange={handlePageChange}
				/>
				<Button
					variant="contained"
					className={classes.expand}
					onClick={handlePageChange(props.node.profilePath)}
				>
					Learn more
				</Button>
			</CardActions>
		</Card>
	);
};
