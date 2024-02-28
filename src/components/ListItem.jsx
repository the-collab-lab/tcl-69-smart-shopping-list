import './ListItem.css';
import { updateItem } from '../api';
import { useState, useEffect } from 'react';

export function ListItem({ item, listPath }) {
	const { id, name, dateLastPurchased } = item;

	const currentDate = new Date();
	const lastPurchasedDate = dateLastPurchased
		? new Date(dateLastPurchased.seconds * 1000)
		: 0;
	const timeDiff = currentDate - lastPurchasedDate; //milliseconds
	const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
	const [isChecked, setIsChecked] = useState(timeDiff < oneDayInMilliseconds);

	useEffect(() => {
		let timeoutId;
		if (isChecked && timeDiff < oneDayInMilliseconds) {
			const timeLeft = oneDayInMilliseconds - timeDiff;
			timeoutId = setTimeout(() => {
				setIsChecked(false);
			}, timeLeft);
		}

		return () => clearTimeout(timeoutId);
	}, [isChecked, timeDiff, oneDayInMilliseconds]);

	async function handleCheck(e) {
		const timeLeftInMilliseconds = oneDayInMilliseconds - timeDiff;
		if (isChecked && timeLeftInMilliseconds > 0) {
			const timeLeftInHours = Math.floor(
				timeLeftInMilliseconds / (1000 * 60 * 60),
			);
			const timeLeftInMinutes = Math.floor(
				(timeLeftInMilliseconds / (1000 * 60)) % 60,
			);
			const alertMessage =
				timeLeftInHours <= 0
					? `You can set this item to be purchased again in ${timeLeftInMinutes} minutes`
					: `You can set this item to be purchased again in ${timeLeftInHours} hours and ${timeLeftInMinutes} minutes`;
			alert(alertMessage);
		} else {
			setIsChecked(e.target.checked);
			if (e.target.checked) {
				const result = await updateItem(listPath, id);
				if (result.success) {
					alert('Item successfully updated');
				} else {
					alert('Error: item not updated');
				}
			}
		}
	}

	return (
		<div>
			<label htmlFor={name} className="ListItem">
				<input
					type="checkbox"
					id={name}
					onChange={handleCheck}
					name={name}
					checked={isChecked}
				/>
				{name}
			</label>
		</div>
	);
}
