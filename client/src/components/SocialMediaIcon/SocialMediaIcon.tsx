import * as React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		popover: {
			pointerEvents: 'none',
		},
		paper: {
			padding: theme.spacing(1),
		},
	}),
);

interface Props {
	contents: string | undefined;
	icon: JSX.Element;
	handlePageChange: (url: string | undefined) => void;
	isEmpty: boolean;
	isClickable: boolean;
}

export const SocialMediaIcon: React.FC<Props> = props => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

	const handlePopoverOpen = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
	) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);

	return (
		<div
			aria-owns={open ? 'mouse-over-popover' : undefined}
			aria-haspopup="true"
			onMouseEnter={handlePopoverOpen}
			onMouseLeave={handlePopoverClose}
		>
			<IconButton>
				{props.isClickable
					? React.cloneElement(props.icon, {
							onClick: props.handlePageChange(props.contents),
					  })
					: props.icon}
			</IconButton>
			<Popover
				id="mouse-over-popover"
				className={classes.popover}
				classes={{
					paper: classes.paper,
				}}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<Typography>
					{props.isEmpty ? '404 Not Found :(' : props.contents}
				</Typography>
			</Popover>
		</div>
	);
};
