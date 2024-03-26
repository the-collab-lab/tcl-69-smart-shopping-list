export async function handleShareList(
	setIsShareDialogOpen,
	setRecipientEmail,
	listPath,
	currentUserId,
	shareList,
) {
	setIsShareDialogOpen(true);
	setRecipientEmail('');
}

export async function handleShareCancelClick(setIsShareDialogOpen) {
	setIsShareDialogOpen(false);
}

export async function handleShareConfirmClick(
	e,
	setIsShareDialogOpen,
	setRecipientEmail,
	listPath,
	currentUserId,
	recipientEmail,
	shareList,
) {
	e.preventDefault();

	let shareResult = await shareList(listPath, currentUserId, recipientEmail);
	// provide an alert confirming that list was shared, or error
	if (shareResult.status === 200) {
		alert(shareResult.message);
		setIsShareDialogOpen(false);
	} else {
		alert(shareResult.message);
		setRecipientEmail('');
		setIsShareDialogOpen(true);
	}
}

export function handleInviteChange(e, setRecipientEmail) {
	const { value } = e.target;
	setRecipientEmail(value.toLowerCase());
}

export function handleAddItem(setIsAddItemDialogOpen, setFormData) {
	setIsAddItemDialogOpen(true);
	// reset form data
	setFormData({ itemName: '', daysUntilNextPurchase: '7' });
	// set default radio button to 'soon'
	document.getElementById('soon').checked = true;
}

export function handleAddItemCancelClick(setIsAddItemDialogOpen) {
	setIsAddItemDialogOpen(false);
}

export async function handleAddItemConfirmClick(
	e,
	setIsAddItemDialogOpen,
	addItem,
	listPath,
	formData,
) {
	e.preventDefault();

	let addItemResult = await addItem(listPath, formData);
	// provide an alert confirming that list was shared, or error
	if (addItemResult.status === 201) {
		alert(addItemResult.message);
		setIsAddItemDialogOpen(false);
	} else {
		alert(addItemResult.error);
		setIsAddItemDialogOpen(true);
	}
}
