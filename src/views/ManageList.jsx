import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Dialog, SortedItemsMap, AddItem } from '../components';

import { addItem } from '../api';
import './List.css';
import { filteredData } from '../utils';

export function ManageList({ data, listPath, currentUserId }) {
	const [searchString, setSearchString] = useState('');
	const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		itemName: '',
		daysUntilNextPurchase: '7',
	});

	const listName = listPath?.split('/')[1];

	const handleChange = (e) => {
		setSearchString(e.target.value);
	};

	const handleClick = (e) => {
		e.preventDefault();
		setSearchString('');
	};

	// ** SORTING DATA LOGIC ***//

	const filteredDataResult = filteredData(data, searchString);

	//** ADD ITEM HANDLERS ***//

	function handleAddItem() {
		setIsAddItemDialogOpen(true);
		// reset form data
		setFormData({ itemName: '', daysUntilNextPurchase: '7' });
		// set default radio button to 'soon'
		document.getElementById('soon').checked = true;
	}

	function handleAddItemCancelClick() {
		setIsAddItemDialogOpen(false);
	}

	async function handleAddItemConfirmClick(e) {
		e.preventDefault();

		let addItemResult = await addItem(listPath, formData);
		// provide an alert confirming that list was shared, or error
		if (addItemResult.status === 201) {
			alert(addItemResult.message);
			setIsAddItemDialogOpen(false);
		} else {
			alert(addItemResult.error);
			setIsAddItemDialogOpen(true);
		}
	}

	return (
		<div>
			<div>
				<h3>Welcome to your "{listName}" list. </h3>
				<button className="add-item-button" onClick={handleAddItem}>
					Add Item
				</button>
			</div>
			{!!data && (
				<form>
					<label htmlFor="searchString">
						Search:{' '}
						<input
							type="text"
							id="searchString"
							name="searchString"
							value={searchString}
							onChange={handleChange}
						/>
					</label>
					{searchString ? <button onClick={handleClick}>x</button> : ''}
				</form>
			)}

			<ul className="List-items-section">
				{data.length ? (
					<SortedItemsMap
						listPath={listPath}
						filteredDataResult={filteredDataResult}
					/>
				) : (
					<>
						<h2 className="no-items-text">You have no items in your list!</h2>
						<br />
						<h3 className="add-item-helper-text">
							Click the "Add Item" button above to get started
						</h3>
					</>
				)}
			</ul>
			<Dialog
				open={isAddItemDialogOpen}
				onCancel={() => setIsAddItemDialogOpen(false)}
				onSubmit={handleAddItemConfirmClick}
			>
				<div className="List-modal-container">
					<div className="List-modal-inner">
						<AddItem formData={formData} setFormData={setFormData} />
						<div className="Dialog--button-group">
							<button
								className="c-button c-button-cancel"
								onClick={handleAddItemCancelClick}
							>
								Cancel
							</button>
							<button
								className="c-button c-button-confirm"
								onClick={handleAddItemConfirmClick}
							>
								Add Item
							</button>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	);
}
