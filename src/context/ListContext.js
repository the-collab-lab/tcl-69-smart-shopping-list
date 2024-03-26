import { createContext, useContext } from 'react';

export const ListContext = createContext({
	searchString: '',
	recipientEmail: '',
	shoppingListName: '',
	isShareDialogOpen: false,
	isAddItemDialogOpen: false,
});
