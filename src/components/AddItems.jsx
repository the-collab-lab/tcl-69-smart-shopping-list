import { useState } from 'react';
import { addItem } from '../api';

export function AddItems({ listPath }) {
	const INITIAL_DATA = {
		itemName: '',
		daysUntilNextPurchase: '7',
	};

	const [formData, setFormData] = useState(INITIAL_DATA);

	function handleChange(e) {
		const { name, value } = e.target;
		setFormData((data) => ({ ...data, [name]: value }));
	}

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

	return (
		<>
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
		</>
	);
}
