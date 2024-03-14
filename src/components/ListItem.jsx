import './ListItem.css';
import { updateItem, deleteItem } from '../api';
import { useState, useEffect } from 'react';

export function ListItem({ item, listPath }) {
	const {
		id,
		name,
		dateLastPurchased,
		totalPurchases,
		dateNextPurchased,
		dateCreated,
	} = item;

	const currentDate = new Date();
	const lastPurchasedDate = dateLastPurchased
		? new Date(dateLastPurchased.seconds * 1000)
		: 0;
	const timeDiff = currentDate - lastPurchasedDate; //milliseconds
	const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		if (timeDiff < oneDayInMilliseconds) {
			setIsChecked(true);
		}

		const timeLeft = oneDayInMilliseconds - timeDiff;
		const timeoutId = setTimeout(() => {
			setIsChecked(false);
		}, timeLeft);

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
				const result = await updateItem(
					listPath,
					id,
					dateLastPurchased,
					totalPurchases,
					dateNextPurchased,
					dateCreated,
				);
				if (result.success) {
					alert('Item purchased');
				} else {
					alert('Error: item not updated');
				}
			}
		}
	}

	async function handleDelete() {
		if (
			window.confirm(`Do you want to delete ${name} from this list?`) === true
		) {
			const result = await deleteItem(id, listPath);
			if (result.success) {
				alert(`${name} has been successfully deleted.`);
			} else {
				alert(
					'An error has occurred. Item not deleted. Please try again. Error: ',
					result.error,
				);
			}
		} else {
			alert('Item not deleted.');
		}
	}

	return (
		<li>
			<label htmlFor={name} className="ListItem">
				<input
					type="checkbox"
					id={name}
					onChange={handleCheck}
					name={name}
					checked={isChecked}
				/>
				{name}
				<button
					type="button"
					id={name}
					name={name}
					onClick={handleDelete}
					aria-label={`delete ${name}`}
				>
					X
				</button>
			</label>
		</li>
	);
}
