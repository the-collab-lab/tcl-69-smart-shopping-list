import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { addItem, shareList, createList } from '../api';
import {
	ShareList,
	AddItem,
	Dialog,
	SingleList,
	NewListForm,
	ListItem,
} from '../components';
import {
	handleShareList,
	handleInviteChange,
	handleShareCancelClick,
	handleShareConfirmClick,
	handleAddItem,
	handleAddItemCancelClick,
	handleAddItemConfirmClick,
	renderCancelButton,
	renderConfirmButton,
	filteredData,
	sortedData,
	sortedItems,
} from '../utils';
import './List.css';

export function List({
	user,
	data,
	lists,
	listPath,
	setListPath,
	currentUserId,
}) {
	const [searchString, setSearchString] = useState('');
	const [recipientEmail, setRecipientEmail] = useState('');
	const [shoppingListName, setShoppingListName] = useState('');
	const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
	const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
	const navigate = useNavigate(); // useNavigate doc suggests using redirect
	const [formData, setFormData] = useState({
		itemName: '',
		daysUntilNextPurchase: '7',
	});

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

	const handleChange = (e) => {
		setSearchString(e.target.value);
	};

	const handleClick = (e) => {
		e.preventDefault();
		setSearchString('');
	};

	const listName = listPath?.split('/')[1];

	const filtered = filteredData(data, searchString);

	const { overdue, buySoon, buyKindOfSoon, buyNotSoon, inactive } =
		sortedItems(filtered);

	if (!currentUserId) {
		return <Navigate to="/" replace={true} />;
	}

	return (
		<>
			<div className="List">
				<h3>Select a list or create a new one</h3>
				<NewListForm
					handleSubmit={handleSubmit}
					shoppingListName={shoppingListName}
					setShoppingListName={setShoppingListName}
				/>
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
				<hr />
				<div>
					<h3>Welcome to your "{listName}" list. </h3>
					<button
						onClick={() =>
							handleShareList(
								setIsShareDialogOpen,
								setRecipientEmail,
								listPath,
								currentUserId,
								shareList,
							)
						}
					>
						Share List
					</button>
				</div>
				<Dialog
					open={isShareDialogOpen}
					onCancel={() => handleShareCancelClick(setIsShareDialogOpen)}
					onSubmit={(e) =>
						handleShareConfirmClick(
							e,
							setIsShareDialogOpen,
							setRecipientEmail,
							listPath,
							currentUserId,
							recipientEmail,
							shareList,
						)
					}
				>
					<ShareList
						handleInviteChange={(e) => handleInviteChange(e, setRecipientEmail)}
					/>
					<div className="Dialog--button-group">
						{renderCancelButton(() =>
							handleShareCancelClick(setIsShareDialogOpen),
						)}
						{renderConfirmButton((e) =>
							handleShareConfirmClick(
								e,
								setIsShareDialogOpen,
								setRecipientEmail,
								listPath,
								currentUserId,
								recipientEmail,
								shareList,
							),
						)}
					</div>
				</Dialog>
				<br />
				{!!sortedData && (
					<form>
						<label htmlFor="searchString">
							Search:
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
					{!!sortedData ? (
						<>
							<h5>Overdue</h5>
							{overdue.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
							<h5>Soon</h5>
							{buySoon.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
							<h5>Kind of soon</h5>
							{buyKindOfSoon.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
							<h5>Not soon</h5>
							{buyNotSoon.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
							<h5>Inactive</h5>
							{inactive.map((item) => (
								<ListItem key={item.id} item={item} listPath={listPath} />
							))}
						</>
					) : (
						<>
							<h2>You have no items in your list!</h2>
							<Link to="/manage-list">
								<button type="button" id="add-first-item">
									Add your first item!
								</button>
							</Link>
						</>
					)}
				</ul>
				<div className="List-btn-wrapper">
					<button
						className="List-add-item-button"
						onClick={() => handleAddItem(setIsAddItemDialogOpen, setFormData)}
					>
						<h1>Add</h1>
						<img src="/img/add-purple.svg" alt="add item" />
					</button>
				</div>
				<Dialog
					open={isAddItemDialogOpen}
					onCancel={() => handleAddItemCancelClick(setIsAddItemDialogOpen)}
					onSubmit={(e) =>
						handleAddItemConfirmClick(
							e,
							setIsAddItemDialogOpen,
							addItem,
							listPath,
							formData,
						)
					}
				>
					<AddItem formData={formData} setFormData={setFormData} />
					<div className="Dialog--button-group">
						{renderCancelButton(() =>
							handleAddItemCancelClick(setIsAddItemDialogOpen),
						)}
						{renderConfirmButton((e) =>
							handleAddItemConfirmClick(
								e,
								setIsAddItemDialogOpen,
								addItem,
								listPath,
								formData,
							),
						)}
					</div>
				</Dialog>
			</div>
		</>
	);
}
