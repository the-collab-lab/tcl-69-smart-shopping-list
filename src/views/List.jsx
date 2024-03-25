import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { addItem, comparePurchaseUrgency, shareList } from '../api';
import { ListItem } from '../components';
import { Dialog } from '../components/Dialog';

import './List.css';
import AlertDialog from '../components/AlertDialog';

export function List({ data, listPath, currentUserId }) {
	const [searchString, setSearchString] = useState('');
	const [recipientEmail, setRecipientEmail] = useState('');
	const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
	const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

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

	let addItemResult = '';

	async function handleAddItemConfirmClick(e) {
		e.preventDefault();

		let addItemResult = await addItem(listPath, formData);
		// provide an alert confirming that list was shared, or error
		if (addItemResult.status === 201) {
			alert(addItemResult.message);
			setIsAddItemDialogOpen(false);
		} else {
			setIsAlertDialogOpen(true);
			// alert(addItemResult.error);
			setIsAddItemDialogOpen(true);
		}
	}

	function handleAlertConfirmClick() {
		setIsAlertDialogOpen(false);
	}

	return (
		<div className="List">
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
			<button className="List-add-item-button" onClick={handleAddItem}>
				<svg
					width="133"
					height="132"
					viewBox="0 0 163 162"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clipPath="url(#clip0_19_85)">
						<path
							d="M162.5 81C162.5 114.681 137.681 139.5 105 139.5H58C25.3193 139.5 0.5 114.681 0.5 81C0.5 47.3188 25.3193 22.5 58 22.5H105C137.681 22.5 162.5 47.3188 162.5 81Z"
							fill="var(--svg-fill-color)"
							stroke="var(--svg-stroke-color)"
						/>
						<rect x="38" y="70" width="86" height="22" rx="5" fill="white" />
						<rect
							x="92"
							y="38"
							width="86"
							height="22"
							rx="5"
							transform="rotate(90 92 38)"
							fill="white"
						/>
					</g>
				</svg>
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
			<Dialog
				open={isAlertDialogOpen}
				onConfirm={handleAlertConfirmClick}
				classNames={Dialog - alert}
			>
				<h2>Wait a sec!</h2>
				<p>{addItemResult.message}</p>
				<div className="Dialog--button-group">
					<button
						className="c-button c-button__danger"
						onClick={handleAlertConfirmClick}
					>
						Yes
					</button>
				</div>
			</Dialog>
		</div>
	);
}
