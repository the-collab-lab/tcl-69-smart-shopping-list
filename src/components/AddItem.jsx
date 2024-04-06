import React from 'react';

export function AddItem({ formData, setFormData }) {
	function handleInputChange(e) {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	}

	return (
		<>
			<h2>Enter item</h2>
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
		</>
	);
}
