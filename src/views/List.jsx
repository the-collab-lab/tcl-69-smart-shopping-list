import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { addItem, shareList } from '../api';
import { createList } from '../api/firebase';
import { AddItem, Dialog, SingleList, SortedItemsMap } from '../components';
import { filteredData } from '../utils';
import './List.css';

export function List({
	user,
	data,
	lists,
	listPath,
	setListPath,
	currentUserId,
}) {
	const [recipientEmail, setRecipientEmail] = useState('');
	const [shoppingListName, setShoppingListName] = useState('');
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

	const navigate = useNavigate(); // useNavigate doc suggests using redirect

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const newListPath = await createList(
				user.uid,
				user.email,
				shoppingListName,
			);
			setListPath(newListPath);
			alert('You have created a new shopping list: ' + shoppingListName);
			navigate('/list');
		} catch (error) {
			alert(`Your list was not created, please try again. Error: ${error}`);
		}
	};

	const listName = listPath?.split('/')[1];

	if (!currentUserId) {
		return <Navigate to="/" replace={true} />;
	}

	//** SHARE LIST HANDLERS ***//

	function handleInviteChange(e) {
		const { value } = e.target;
		setRecipientEmail(value.toLowerCase());
	}

	async function handleShareList() {
		setIsShareDialogOpen(true);
		setRecipientEmail('');
	}

	function handleShareCancelClick() {
		setIsShareDialogOpen(false);
	}

	async function handleShareConfirmClick(e) {
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

	return (
		<>
			<div className="List">
				<h3>Select a list or create a new one</h3>
				<form onSubmit={handleSubmit}>
					<label>
						New list name:{' '}
						<input
							type="text"
							value={shoppingListName}
							id="shopping-list"
							onChange={(e) => setShoppingListName(e.target.value)}
						></input>
					</label>{' '}
					<input type="submit" value="Create!" />
				</form>
				<ul>
					{!!lists ? (
						lists.map((list) => (
							<SingleList
								key={list.name}
								name={list.name}
								setListPath={setListPath}
								path={list.path}
							/>
						))
					) : (
						<h1>You have no Lists!</h1>
					)}
				</ul>

				<div>
					<button onClick={handleShareList}>Share List</button>
				</div>
				<Dialog
					open={isShareDialogOpen}
					onCancel={() => setIsShareDialogOpen(false)}
					onSubmit={handleShareConfirmClick}
				>
					<h2>Who are you sharing this list with?</h2>
					<div className="List-share-email-dialog-container">
						<label htmlFor="invite-to-list">
							Enter email:
							<input
								type="email"
								id="invite-to-list"
								name="inviteToList"
								onChange={handleInviteChange}
							/>
						</label>
						<div className="Dialog--button-group">
							<button
								className="c-button c-button-cancel"
								onClick={handleShareCancelClick}
							>
								Cancel
							</button>
							<button
								className="c-button c-button-confirm"
								onClick={handleShareConfirmClick}
							>
								Confirm
							</button>
						</div>
					</div>
				</Dialog>
			</div>
		</>
	);
}
