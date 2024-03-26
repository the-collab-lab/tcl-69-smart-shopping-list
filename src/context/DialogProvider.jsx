import { Dialog } from '@/interfaces';
import { DialogContext } from './DialogContext';
import React, { useState } from 'react';

function DialogContextProvider({ children }) {
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
	const addDialog = (dialog) => {
		dialog.id = dialogs.length;
		setDialogs([...dialogs, dialog]);
	};
	const deleteDialog = (id) => {
		setDialogs(dialogs.filter((dialog) => dialog.id !== id));
	};

	return (
		<DialogContext.Provider
			value={{
				dialogs,
				addDialog,
				deleteDialog,
			}}
		>
			{children}
		</DialogContext.Provider>
	);
}

export default DialogContextProvider;
