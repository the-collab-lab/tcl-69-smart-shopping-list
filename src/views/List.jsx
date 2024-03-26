import { useState } from 'react';
import { ListItem } from '../components';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SingleList, NewListForm } from '../components';
import { createList } from '../api/firebase';
import { addItem, comparePurchaseUrgency, shareList } from '../api';
import { Dialog } from '../components/Dialog';

import './List.css';
import { AddItem } from '../components/dialogs/AddItem';
import { ShareList } from '../components/dialogs/ShareList';

export function List({
	user,
	data,
	lists,
	listPath,
	setListPath,
	currentUserId,
}) {
	const [searchString, setSearchString] = useState('');
	const [recipientEmail, setRecipientEmail] = useState('');
	const [shoppingListName, setShoppingListName] = useState('');
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
	const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
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

	const handleChange = (e) => {
		setSearchString(e.target.value);
	};

	const handleClick = (e) => {
		e.preventDefault();
		setSearchString('');
	};

	const listName = listPath?.split('/')[1];

	const filteredData = data.filter((d) =>
		d.name?.toLowerCase().includes(searchString.toLowerCase()),
	);

	const sortedData = comparePurchaseUrgency(filteredData);

	const overdue = [],
		buySoon = [],
		buyKindOfSoon = [],
		buyNotSoon = [],
		inactive = [];

	sortedData.forEach((item) => {
		if (item.isOverdue) {
			overdue.push(item);
		} else if (item.daysSinceLastPurchase >= 60) {
			inactive.push(item);
		} else if (item.daysUntilNextPurchase <= 7) {
			buySoon.push(item);
		} else if (
			item.daysUntilNextPurchase > 7 &&
			item.daysUntilNextPurchase < 15
		) {
			buyKindOfSoon.push(item);
		} else if (item.daysUntilNextPurchase >= 15) {
			buyNotSoon.push(item);
		}
	});

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

	//** ADD ITEM HANDLERS ***//

	const INITIAL_DATA = {
		itemName: '',
		daysUntilNextPurchase: '7',
	};

	const [formData, setFormData] = useState(INITIAL_DATA);

	function handleAddItem() {
		setIsAddItemDialogOpen(true);
		// reset form data
		setFormData({ itemName: '', daysUntilNextPurchase: '7' });
		// set default radio button to 'soon'
		document.getElementById('soon').checked = true;
	}

	function handleAddItemCancelClick() {
		setIsAddItemDialogOpen(false);
	}

	async function handleAddItemConfirmClick(e) {
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

	return (
		<>
			<div className="List">
				<h3>Select a list or create a new one</h3>
				<NewListForm
					handleSubmit={handleSubmit}
					shoppingListName={shoppingListName}
					setShoppingListName={setShoppingListName}
				/>
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
				<hr />
				<div>
					<h3>Welcome to your "{listName}" list. </h3>
					<button onClick={handleShareList}>Share List</button>
				</div>
				<Dialog
					open={isShareDialogOpen}
					onCancel={() => setIsShareDialogOpen(false)}
					onSubmit={handleShareConfirmClick}
				>
					<ShareList handleInviteChange={handleInviteChange} />
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
				</Dialog>
				<br />
				{!!sortedData && (
					<form>
						<label htmlFor="searchString">
							Search:
							<input
								type="text"
								id="searchString"
								name="searchString"
								value={searchString}
								onChange={handleChange}
							/>
						</label>
						{searchString ? <button onClick={handleClick}>x</button> : ''}
					</form>
				)}

				<ul className="List-items-section">
					{!!sortedData ? (
						<>
							<h5>Overdue</h5>
							{overdue.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
							<h5>Soon</h5>
							{buySoon.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
							<h5>Kind of soon</h5>
							{buyKindOfSoon.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
							<h5>Not soon</h5>
							{buyNotSoon.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
							<h5>Inactive</h5>
							{inactive.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
						</>
					) : (
						<>
							<h2>You have no items in your list!</h2>
							<Link to="/manage-list">
								<button type="button" id="add-first-item">
									Add your first item!
								</button>
							</Link>
						</>
					)}
				</ul>
				<div className="List-btn-wrapper">
					<button className="List-add-item-button" onClick={handleAddItem}>
						<h1>Add</h1>
						<img src="/img/add-purple.svg" alt="add item" />
					</button>
				</div>
				<Dialog
					open={isAddItemDialogOpen}
					onCancel={() => setIsAddItemDialogOpen(false)}
					onSubmit={handleAddItemConfirmClick}
				>
					<AddItem formData={formData} setFormData={setFormData} />
					<div className="Dialog--button-group">
						<button
							className="c-button c-button-cancel"
							onClick={handleAddItemCancelClick}
						>
							Cancel
						</button>
						<button
							className="c-button c-button-confirm"
							onClick={handleAddItemConfirmClick}
						>
							Add Item
						</button>
					</div>
				</Dialog>
			</div>
		</>
	);
}
