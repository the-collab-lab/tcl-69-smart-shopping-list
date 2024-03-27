import { useState } from 'react';
import { ListItem } from '../components';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SingleList } from '../components';
import { createList } from '../api/firebase';
import { addItem, comparePurchaseUrgency, shareList } from '../api';
import { Dialog } from '../components/Dialog';

import './List.css';

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
	const [isDialogOpen, setIsDialogOpen] = useState(false);
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

	function handleInputChange(e) {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	}

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
					{lists && lists.length > 0 ? (
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
				<br />
				{data && data.length > 0 && (
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
					{data && data.length > 0 ? (
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
				<button className="List-add-item-button" onClick={handleAddItem}>
					<img src="/img/add-green.svg" alt="add item" />
				</button>
				<Dialog
					open={isAddItemDialogOpen}
					onCancel={() => setIsAddItemDialogOpen(false)}
					onSubmit={handleAddItemConfirmClick}
				>
					<div className="List-modal-container">
						<div className="List-modal-inner">
							<div>Enter item</div>
							<label htmlFor="itemName">
								Item Name:
								<input
									type="text"
									id="itemName"
									name="itemName"
									value={formData.itemName}
									onChange={handleInputChange}
									required
								></input>
							</label>
							<br />
							<p>Buy again?</p>
							<label htmlFor="soon">
								Soon:
								<input
									type="radio"
									id="soon"
									name="daysUntilNextPurchase"
									value="7"
									onChange={handleInputChange}
									defaultChecked
								></input>
							</label>
							<br />
							<label htmlFor="kind-of-soon">
								Kind of soon:
								<input
									type="radio"
									id="kind-of-soon"
									name="daysUntilNextPurchase"
									value="14"
									onChange={handleInputChange}
								></input>
							</label>
							<br />
							<label htmlFor="not-soon">
								Not soon:
								<input
									type="radio"
									id="not-soon"
									name="daysUntilNextPurchase"
									value="30"
									onChange={handleInputChange}
								></input>
							</label>
							<br />
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
						</div>
					</div>
				</Dialog>
			</div>
		</>
	);
}
