import { useState } from 'react';
import { addItem, shareList } from '../api';
import { ListItem } from '../components';
import { Link } from 'react-router-dom';
import { comparePurchaseUrgency } from '../api';
import './List.css';

export function ManageList({ data, listPath, currentUserId }) {
	const [searchString, setSearchString] = useState('');

	const handleSearchChange = (e) => {
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

	const INITIAL_DATA = {
		itemName: '',
		daysUntilNextPurchase: '7',
	};

	const [formData, setFormData] = useState(INITIAL_DATA);
	const [recipientEmail, setRecipientEmail] = useState('');

	function handleChange(e) {
		const { name, value } = e.target;
		setFormData((data) => ({ ...data, [name]: value }));
	}

	function handleInviteChange(e) {
		const { value } = e.target;
		setRecipientEmail(value);
	}

	//Enter key also submits the form as long as user is on one of the input field
	async function handleSubmit(e) {
		e.preventDefault();

		formData.daysUntilNextPurchase = +formData.daysUntilNextPurchase;
		let result = await addItem(listPath, formData);
		if (result && result.success) {
			setFormData(INITIAL_DATA);
			alert('Item saved!');
		} else if (result && result.error) {
			alert(result.error);
		} else {
			alert('Item cannot be saved to database, please try again.');
		}
	}

	async function handleInviteSubmit(e) {
		e.preventDefault();
		let shareResult = await shareList(listPath, currentUserId, recipientEmail);

		// provide an alert confirming that list was shared, or error
		if (shareResult) {
			alert(shareResult);
		}
	}

	return (
		<>
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
							onChange={handleSearchChange}
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
			<form onSubmit={handleSubmit}>
				<label htmlFor="itemName">
					Item Name:
					<input
						type="text"
						id="itemName"
						name="itemName"
						value={formData.itemName}
						onChange={handleChange}
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
						onChange={handleChange}
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
						onChange={handleChange}
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
						onChange={handleChange}
					></input>
				</label>
				<br />
				<button type="submit">Submit</button>
			</form>
			<form onSubmit={handleInviteSubmit}>
				<br />
				<label htmlFor="invite-to-list">
					Enter email:
					<input
						type="email"
						id="invite-to-list"
						name="inviteToList"
						onChange={handleInviteChange}
					/>
				</label>
				<small> "Please enter email using lowercase letters only."</small>
				<br />
				<button type="submit">Invite User</button>
			</form>
		</>
	);
}
