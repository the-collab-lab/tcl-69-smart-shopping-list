import { useState } from 'react';
import { ListItem } from '../components';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SingleList } from '../components';
import { createList } from '../api/firebase';
import { comparePurchaseUrgency, shareList } from '../api';
import { Dialog } from '../components/Dialog';
import ShareEmailInput from '../components/ShareEmailInput';

import './List.css';

export function List({ data, listPath, setListPath, currentUserId }) {
	const [searchString, setSearchString] = useState('');
	const [recipientEmail, setRecipientEmail] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [shoppingListName, setShoppingListName] = useState('');
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

	async function handleShareList() {
		setIsDialogOpen(true);
	}

	function handleCancelClick() {
		setIsDialogOpen(false);
	}

	async function handleConfirmClick(e) {
		e.preventDefault();
		let shareResult = await shareList(listPath, currentUserId, recipientEmail);
		// provide an alert confirming that list was shared, or error
		if (shareResult.status === 200) {
			alert(shareResult.message);
			setIsDialogOpen(false);
		} else {
			alert(shareResult.message);
			setRecipientEmail('');
			setIsDialogOpen(true);
		}
	}

	return (
		<>
			<div className="List">
				<ul>
					{data && data.length > 0 ? (
						data.map((list) => (
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
				<form onSubmit={handleSubmit}>
					<label>
						Shopping List:
						<input
							type="text"
							value={shoppingListName}
							id="shopping-list"
							onChange={(e) => setShoppingListName(e.target.value)}
						></input>
					</label>
					<input type="submit" />
				</form>
				<div>
					<h3>Welcome to your "{listName}" list. </h3>
					<button onClick={handleShareList}>Share List</button>
				</div>
				<Dialog
					open={isDialogOpen}
					onCancel={() => setIsDialogOpen(false)}
					onSubmit={handleConfirmClick}
				>
					<h2>Who are you sharing this list with?</h2>
					<div className="List-share-email-dialog-container">
						<ShareEmailInput setRecipientEmail={setRecipientEmail} />
						<div className="Dialog--button-group">
							<button
								className="c-button c-button-cancel"
								onClick={handleCancelClick}
							>
								Cancel
							</button>
							<button
								className="c-button c-button-confirm"
								onClick={handleConfirmClick} // Remove arguments here
							>
								Confirm
							</button>
						</div>
					</div>
				</Dialog>

				{sortedData && sortedData.length > 0 && (
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
					{sortedData && sortedData.length > 0 ? (
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
			</div>
			<form onSubmit={handleSubmit}>
				<label>
					Shopping List:
					<input
						type="text"
						value={shoppingListName}
						id="shopping-list"
						onChange={(e) => setShoppingListName(e.target.value)}
					></input>
				</label>
				<input type="submit" />
			</form>
		</>
	);
}
