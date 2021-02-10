import * as React from 'react';
import { WelcomeCarousel } from '../../components/WelcomeCarousel/WelcomeCarousel';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline, Grid } from '@material-ui/core';

const useStyles = makeStyles(() => ({
	root: {
		minHeight: '100vh',
		backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/bg.jpg'})`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
	},
	title: {
		color: 'black',
	},
}));

interface Props {}

export const Home: React.FC<Props> = (): JSX.Element => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<CssBaseline />
			<NavigationBar />
			<Grid
				container
				justify="center"
				spacing={0}
				alignItems="center"
				style={{ minHeight: '100vh' }}
			>
				<WelcomeCarousel />
			</Grid>
		</div>
	);
};
