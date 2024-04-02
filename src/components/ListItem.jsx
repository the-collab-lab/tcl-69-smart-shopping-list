import { useState, useEffect } from 'react';
import { updateItem, deleteItem } from '../api';
import './ListItem.css';

export function ListItem({ item, listPath }) {
	const [isChecked, setIsChecked] = useState(false);

	const {
		id,
		name,
		dateLastPurchased,
		totalPurchases,
		dateNextPurchased,
		dateCreated,
	} = item;

	const currentDate = new Date();

	const nextPurchasedDateArr = new Date(dateNextPurchased.seconds * 1000)
		.toString()
		.split(' ');
	const nextPurchasedDate = nextPurchasedDateArr.slice(0, 4).join(' ');

	const lastPurchasedDate = dateLastPurchased
		? new Date(dateLastPurchased.seconds * 1000)
		: 0;
	const timeDiff = currentDate - lastPurchasedDate; //milliseconds
	const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

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
				// For testing this is turned off

				const result = console.log('checked');
				// const result = await updateItem(
				// 	listPath,
				// 	id,
				// 	dateLastPurchased,
				// 	totalPurchases,
				// 	dateNextPurchased,
				// 	dateCreated,
				// );
				// if (result.success) {
				// 	alert('Item purchased');
				// } else {
				// 	alert('Error: item not updated');
				// }
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
		<li className="ListItem">
			<label htmlFor={name} className="ListItem-label">
				<input
					type="checkbox"
					id={name}
					onChange={handleCheck}
					name={name}
					checked={isChecked}
				/>
				<p className="ListItem-buy-next">{name}</p>
				<button
					type="button"
					id={name}
					name={name}
					onClick={handleDelete}
					aria-label={`delete ${name}`}
				>
					Remove
				</button>
			</label>
			<p className="ListItem-buy-next">Buy Next: {nextPurchasedDate}</p>
		</li>
	);
}
