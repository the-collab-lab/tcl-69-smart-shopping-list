import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { addItem, shareList } from '../api';
import { createList } from '../api/firebase';
import { AddItem, Dialog, SingleList, SortedItemsMap } from '../components';
import { filteredData } from '../utils';
import './List.css';

export function List({
	user,
	data,
	lists,
	listPath,
	setListPath,
	currentUserId,
}) {
	const [shoppingListName, setShoppingListName] = useState('');

	const navigate = useNavigate(); // useNavigate doc suggests using redirect

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const newListPath = await createList(
				user.uid,
				user.email,
				shoppingListName,
			);
			setListPath(newListPath);
			alert('You have created a new shopping list: ' + shoppingListName);
			navigate('/list');
		} catch (error) {
			alert(`Your list was not created, please try again. Error: ${error}`);
		}
	};

	if (!currentUserId) {
		return <Navigate to="/" replace={true} />;
	}

	return (
		<>
			<div className="List">
				<h3>Select a list or create a new one</h3>
				<form onSubmit={handleSubmit}>
					<label>
						New list name:{' '}
						<input
							type="text"
							value={shoppingListName}
							id="shopping-list"
							onChange={(e) => setShoppingListName(e.target.value)}
						></input>
					</label>{' '}
					<input type="submit" value="Create!" />
				</form>
				<ul>
					{!!lists ? (
						lists.map((list) => (
							<SingleList
								key={list.name}
								name={list.name}
								setListPath={setListPath}
								path={list.path}
							/>
						))
					) : (
						<h1>You have no Lists!</h1>
					)}
				</ul>
			</div>
		</>
	);
}
