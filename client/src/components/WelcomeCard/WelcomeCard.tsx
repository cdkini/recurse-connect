import * as React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardMedia, IconButton, Button } from '@material-ui/core';
// import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
// import CardActions from '@material-ui/core/CardActions';
// import Avatar from '@material-ui/core/Avatar';
// import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {WelcomeAccordion} from "../WelcomeAccordion/WelcomeAccordion";
import GitHubIcon from '@material-ui/icons/GitHub';
// import TwitterIcon from '@material-ui/icons/Twitter';
// import EmailIcon from '@material-ui/icons/Email';
// import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 1000,
            width: 750,
            height: 500,
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
}

export const WelcomeCard: React.FC<Props> = ({ }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h3">Welcome to Recurse Connect!</Typography>
                <Typography>From BFS to BFF's</Typography>
                <Typography>
                Recurse Connect uses the Recurse Center API to visualize connections between participants;
                use it to reconnect with old friends or perhaps discover some new ones!
                </Typography>
                <Typography>Navigation is done through the app bar; here's a sneak peek of what you'll find:</Typography>
            </CardContent>
            <WelcomeAccordion/>
            <CardMedia />
<Button variant="contained" color="primary">Login</Button>
                <IconButton>
                    <GitHubIcon />
                </IconButton>
        </Card>
    );
}
