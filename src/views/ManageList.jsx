import { useState } from 'react';
import { addItem, shareList } from '../api';

export function ManageList({ listPath, currentUserId }) {
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
		if (result.success) {
			setFormData(INITIAL_DATA);
			alert('Item saved!');
		} else {
			alert('Item not saved to database, please try again');
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
			<p>
				Hello from the <code>/manage-list</code> page!
			</p>
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
				<br />
				<button type="submit">Invite User</button>
			</form>
		</>
	);
}
