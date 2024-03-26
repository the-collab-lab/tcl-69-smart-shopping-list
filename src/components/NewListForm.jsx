import React from 'react';

export function NewListForm({
	handleSubmit,
	shoppingListName,
	setShoppingListName,
}) {
	return (
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
	);
}
