import * as React from 'react';
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import GitHubIcon from '@material-ui/icons/GitHub';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			height: 500,
			justify: 'center',
			align: 'center',
			alignItems: 'center',
			textAlign: 'center',
		},
		button: {
			margin: theme.spacing(1),
			justify: 'center',
			align: 'center',
			alignItems: 'center',
			textAlign: 'center',
			background: 'black',
			textTransform: 'none',
			borderRadius: '20px',
		},
		carousel: {
			position: 'absolute',
		},
		illustration: {
			width: '75%',
			height: '75%',
		},
	}),
);

interface Props {}

export const WelcomeCarousel: React.FC<Props> = ({}) => {
	const classes = useStyles();
	const [state, setState] = React.useState({ open: false });

	let history = useHistory();
	const redirectToLogin = () => {
		history.push('/login');
	};
	const redirectToGitHub = () => {
		window.open('https://github.com/cdkini/recurse-connect');
	};

	return (
		<div className={classes.root}>
			<br></br>
			<br></br>
			<br></br>
			<br></br>
			<br></br>
			<h1>Recurse Connect</h1>
			<h3>Using BFS to find you a new BFF</h3>
			<br></br>
			<Button
				className={classes.button}
				variant="contained"
				color="primary"
				onClick={() => setState({ open: true })}
				startIcon={<PlayArrowIcon />}
			>
				Get started
			</Button>
			<Button
				className={classes.button}
				variant="contained"
				color="primary"
				onClick={redirectToGitHub}
				startIcon={<GitHubIcon />}
			>
				Contribute
			</Button>
			<AutoRotatingCarousel
				className={classes.carousel}
				label="Login"
				interval={6000}
				open={state.open}
				onClose={() => setState({ open: false })}
				onStart={redirectToLogin}
			>
				<Slide
					media={
						<img
							className={classes.illustration}
							src={process.env.PUBLIC_URL + '/assets/undraw-connection.svg'}
							alt="undraw-connection"
						/>
					}
					mediaBackgroundStyle={{ backgroundColor: green[400] }}
					style={{ backgroundColor: green[600] }}
					title="Welcome to Recurse Connect!"
					subtitle="Using BFS to find you a new BFF."
				/>
				<Slide
					media={
						<img
							className={classes.illustration}
							src={process.env.PUBLIC_URL + '/assets/undraw-messages.svg'}
							alt="undraw-messages"
						/>
					}
					mediaBackgroundStyle={{ backgroundColor: green[400] }}
					style={{ backgroundColor: green[600] }}
					title="Feed"
					subtitle="See what your fellow Recursers are up to!"
				/>
				<Slide
					media={
						<img
							className={classes.illustration}
							src={process.env.PUBLIC_URL + '/assets/undraw-friends.svg'}
							alt="undraw-friends"
						/>
					}
					mediaBackgroundStyle={{ backgroundColor: green[400] }}
					style={{ backgroundColor: green[600] }}
					title="Network"
					subtitle="Get to know the participants you've crossed paths with a bit better!"
				/>
				<Slide
					media={
						<img
							className={classes.illustration}
							src={process.env.PUBLIC_URL + '/assets/undraw-happy.svg'}
							alt="undraw-happy"
						/>
					}
					mediaBackgroundStyle={{ backgroundColor: green[400] }}
					style={{ backgroundColor: green[600] }}
					title="Discover"
					subtitle="Dive into 10 years of RC history, starting from the Hacker School days."
				/>
				<Slide
					media={
						<img
							className={classes.illustration}
							src={process.env.PUBLIC_URL + '/assets/undraw-thinking.svg'}
							alt="undraw-thinking"
						/>
					}
					mediaBackgroundStyle={{ backgroundColor: green[400] }}
					style={{ backgroundColor: green[600] }}
					title="Contribute"
					subtitle="Have an idea to improve Recurse Connect? This site is built by and for the RC community so feel free to leave an issue or PR at our GitHub repo."
				/>
			</AutoRotatingCarousel>
		</div>
	);
};
