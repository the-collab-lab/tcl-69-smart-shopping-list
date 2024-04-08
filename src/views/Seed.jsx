import React, { useState } from 'react';
import { createList } from '../api';

export function Seed({ user, lists, setListPath, currentUserId }) {
	// Psuedo code for this component is as follows:
	// 1. Create a form that takes a name of list input
	// 2. Create a button that will submit the form
	// 3. Create a function that will handle the form submission
	// 4. Inside the function, call the updateList function from the api
	// 5. This function will take a generic 5 items and use the current date to make each item fall into a separate urgency category
	// 6. The goal is to get a set of items in a list that will be used to test the app's functionality

	const [shoppingListName, setShoppingListName] = useState('');

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

	return (
		<>
			<h1>Seed data to your list</h1>
			<form onSubmit={handleSubmit}>
				<label
					htmlFor="shopping-list-input"
					className="search-build List-items-section"
				>
					<span className="new-list">search</span>
					<input
						type="text"
						value={shoppingListName}
						id="shopping-list-input"
						name="shopping-list"
						className="search-input"
						placeholder="Enter a new list name"
						onChange={(e) => setShoppingListName(e.target.value)}
					/>
					<input type="submit" value="Create!" className="create-list-btn" />
				</label>
			</form>
		</>
	);
}
