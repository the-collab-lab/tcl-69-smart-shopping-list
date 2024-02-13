import './Home.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SingleList } from '../components';
import { createList } from '../api/firebase';

export function Home({ data, setListPath, user }) {
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

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<ul>
				{data && data.length > 0 ? (
					data.map((list) => (
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
			<form onSubmit={handleSubmit}>
				<label>
					Shopping List:
					<input
						type="text"
						value={shoppingListName}
						id="shopping-list"
						onChange={(e) => setShoppingListName(e.target.value)}
					></input>
				</label>
				<input type="submit" />
			</form>
		</div>
	);
}
