import * as React from 'react';
import { Dialog } from '@material-ui/core';
import { RecurserCard } from '../RecurserCard/RecurserCard';
import { NetworkGraphContext } from '../../contexts/NetworkGraphContext/NetworkGraphContext';

interface Props {}

export const RecurserCardDialog: React.FC<Props> = () => {
	const { focusedNode, openDialog, handleDialogClose } = React.useContext(
		NetworkGraphContext,
	);

	return (
		<Dialog onClose={handleDialogClose} open={openDialog}>
			<RecurserCard node={focusedNode} />
		</Dialog>
	);
};
