import { useState } from 'react';
import { ListItem } from '../components';

export function List({ data, listPath }) {
	const [searchString, setSearchString] = useState('');

	const handleChange = (e) => {
		setSearchString(e.target.value);
	};

	const handleClick = (e) => {
		e.preventDefault();
		setSearchString('');
	};

	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
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
					<h1>You have no items in your list!</h1>
				)}
			</ul>
		</>
	);
}
