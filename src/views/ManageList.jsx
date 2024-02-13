import { useState } from 'react';

export function ManageList() {
	const INITIAL_DATA = {
		itemName: '',
		timeEstimate: 'soon',
	};

	const [formData, setFormData] = useState(INITIAL_DATA);

	function handleChange(e) {
		const { name, value } = e.target;
		console.log('name clicked:', name, 'value clicked:', value);
		setFormData((data) => ({ ...data, [name]: value }));
		console.log('formData', formData);
	}

	//Enter key also submits the form as long as user is on one of the input field
	async function handleSubmit(e) {
		e.preventDefault();
		alert('form submitted');
		setFormData(INITIAL_DATA);
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
						name="timeEstimate"
						value="soon"
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
						name="timeEstimate"
						value="kind-of-soon"
						onChange={handleChange}
					></input>
				</label>
				<br />
				<label htmlFor="not-soon">
					Not soon:
					<input
						type="radio"
						id="not-soon"
						name="timeEstimate"
						value="not-soon"
						onChange={handleChange}
					></input>
				</label>
				<br />
				<button type="submit">Submit</button>
			</form>
		</>
	);
}
