import { useState } from 'react';
import { ListItem } from '../components';
import { Link } from 'react-router-dom';

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

	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<h1>Welcome to your "{listName}" list. </h1>
			{data && data.length > 0 && (
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
				{data && data.length > 0 ? (
					data
						.filter((d) =>
							d.name?.toLowerCase().includes(searchString.toLowerCase()),
						)
						.map((item, id) => (
							<ListItem key={id} item={item} listPath={listPath} />
						))
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
