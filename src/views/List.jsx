import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createList } from '../api/firebase';
import { SingleList } from '../components';
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
					<label
						htmlFor="shopping-list-input"
						className="create-list-container"
					>
						<span class="new-list">search</span>
						<input
							type="text"
							value={shoppingListName}
							id="shopping-list-input"
							name="shopping-list"
							placeholder="Enter a new list name"
							onChange={(e) => setShoppingListName(e.target.value)}
						/>
					</label>
					<input type="submit" value="Create!" className="create-list-btn" />
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
