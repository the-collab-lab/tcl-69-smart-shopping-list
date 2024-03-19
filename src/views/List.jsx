import { useState } from 'react';
import { ListItem } from '../components';
import { Link } from 'react-router-dom';
import { comparePurchaseUrgency, shareList } from '../api';
import { ShareListDialog } from '../components/ShareListDialog';

import './List.css';
import ShareEmailInput from '../components/ShareEmailInput';

export function List({ data, listPath, currentUserId }) {
	const [searchString, setSearchString] = useState('');
	const [recipientEmail, setRecipientEmail] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleChange = (e) => {
		setSearchString(e.target.value);
	};

	const handleClick = (e) => {
		e.preventDefault();
		setSearchString('');
	};

	const listName = listPath.split('/')[1];

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

	async function handleShareList() {
		setIsDialogOpen(true);
	}

	function handleCancelClick() {
		setIsDialogOpen(false);
	}

	async function handleConfirmClick() {
		let shareResult = await shareList(listPath, currentUserId, recipientEmail);
		// provide an alert confirming that list was shared, or error
		if (shareResult) {
			alert(shareResult);
		}
		setIsDialogOpen(false);
	}

	return (
		<>
			<div className="list-inner-menu">
				<p>
					Hello from the <code>/list</code> page!
				</p>
				<button className="share-list-button" onClick={handleShareList}>
					Share List
				</button>
			</div>
			<ShareListDialog
				open={isDialogOpen}
				onConfirm={handleConfirmClick}
				onCancel={handleCancelClick}
			>
				<h2>Who would you like to share this list with?</h2>
				<ShareEmailInput setRecipientEmail={setRecipientEmail} />
				<p>Are you sure?</p>
				<div className="Dialog--button-group">
					<button className="c-button" onClick={handleCancelClick}>
						No
					</button>
					<button
						className="c-button c-button__danger"
						onClick={() =>
							handleConfirmClick(listPath, currentUserId, recipientEmail)
						}
					>
						Yes
					</button>
				</div>
			</ShareListDialog>

			<h5>Welcome to your "{listName}" list. </h5>
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

			<ul>
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
		</>
	);
}
