import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import PublicIcon from '@material-ui/icons/Public';
import { CardMedia, Button, Fade } from '@material-ui/core';
import { WelcomeAccordion } from '../WelcomeAccordion/WelcomeAccordion';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxWidth: 1000,
			width: 750,
			height: 500,
			justify: 'center',
			alignItems: 'center',
			textAlign: 'center',
		},
		button: {
			margin: theme.spacing(1),
			justify: 'center',
			align: 'center',
			alignItems: 'center',
			textAlign: 'center',
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
	}),
);

interface Props {}

export const WelcomeCard: React.FC<Props> = ({}) => {
	const classes = useStyles();
	const [checked, setChecked] = React.useState(false);

	const handleChange = () => {
		setChecked(prev => !prev);
	};

	return (
		<div className={classes.root}>
			<div>
				<Fade in={checked}>
					<Card>
						<CardHeader
							title="Welcome to Recurse Connect!"
							subheader="From BFS to BFF's"
						/>
						<CardMedia
							className="media"
							image="https://d29xw0ra2h4o4u.cloudfront.net/assets/logo_square-051508b5ecf8868635aea567bb86f423f4d1786776e5dfce4adf2bc7edf05804.png"
						/>
						<CardContent>
							<Typography>
								Recurse Connect uses the Recurse Center API to visualize
								connections between participants; use it to reconnect with old
								friends or perhaps discover some new ones!
							</Typography>
							<Button variant="contained" color="primary">
								Login
							</Button>
							<br></br>
							<Typography>
								Navigation is done through the app bar; here's a sneak peek of
								what you'll find:
							</Typography>
						</CardContent>
						<WelcomeAccordion />
						<CardMedia />
					</Card>
				</Fade>
				<Button
					variant="contained"
					color="primary"
					startIcon={<PublicIcon />}
					onClick={handleChange}
				>
					Get connected
				</Button>
			</div>
		</div>
	);
};
