import * as React from 'react';
// import { WelcomeCard } from '../../components/WelcomeCard/WelcomeCard';
import { WelcomeCarousel } from '../../components/WelcomeCarousel/WelcomeCarousel';
import { NavigationBar } from '../../components/NavigationBar/NavigationBar';
// import { FuzzySearchBar } from '../../components/FuzzySearchBar/FuzzySearchBar';
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

export const Home: React.FC<Props> = () => {
	const classes = useStyles();
	// const theme = useTheme();
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
