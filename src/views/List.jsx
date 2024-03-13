import { useState } from 'react';
import { ListItem } from '../components';
import { Link } from 'react-router-dom';
import { comparePurchaseUrgency } from '../api';

export function List({ data, listPath }) {
	const [searchString, setSearchString] = useState('');

	const handleChange = (e) => {
		setSearchString(e.target.value);
	};

	const handleClick = (e) => {
		e.preventDefault();
		setSearchString('');
	};

	const listName = listPath.split('/')[1];

	const filteredData = data.filter((d) =>
		d.name?.toLowerCase().includes(searchString.toLowerCase()),
	);

	const sortedData = comparePurchaseUrgency(filteredData);
	// console.log('sorted data', sortedData)

	//soon <= 7 next purchase
	const buySoon = sortedData.filter(
		(item) =>
			item.daysUntilNextPurchase <= 7 && item.daysSinceLastPurchase < 60,
	);

	//kind of soon 8 to 29 next purchase
	const buyKindOfSoon = sortedData.filter(
		(item) =>
			item.daysUntilNextPurchase > 7 &&
			item.daysUntilNextPurchase < 15 &&
			item.daysSinceLastPurchase < 60,
	);
	//not soon >= 30 next purchase
	const buyNotSoon = sortedData.filter(
		(item) =>
			item.daysUntilNextPurchase >= 15 && item.daysSinceLastPurchase < 60,
	);

	//inactive -- last purchase
	const inactive = sortedData.filter(
		(item) => item.daysSinceLastPurchase >= 60,
	);

	console.log('soon', buySoon);
	console.log('kind of soon', buyKindOfSoon);
	console.log('not soon', buyNotSoon);
	console.log('inactive', inactive);

	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<h5>Welcome to your "{listName}" list. </h5>
			{sortedData && sortedData.length > 0 && (
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

			<ul>
				{sortedData && sortedData.length > 0 ? (
					<>
						<h5>Soon</h5>
						{buySoon.map((item, id) => (
							<ListItem key={id} item={item} listPath={listPath} />
						))}
						<h5>Kind of soon</h5>
						{buyKindOfSoon.map((item, id) => (
							<ListItem key={id} item={item} listPath={listPath} />
						))}
						<h5>Not soon</h5>
						{buyNotSoon.map((item, id) => (
							<ListItem key={id} item={item} listPath={listPath} />
						))}
						<h5>Inactive</h5>
						{inactive.map((item, id) => (
							<ListItem key={id} item={item} listPath={listPath} />
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
		</>
	);
}
