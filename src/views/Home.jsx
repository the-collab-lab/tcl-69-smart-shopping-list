import './Home.css';
import { SingleList } from '../components';

export function Home({ data, setListPath }) {
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('you submitted');
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
				<label for="shopping-list">
					Shopping List:
					<input type="text" name="name" id="shopping-list"></input>
				</label>
			</form>
		</div>
	);
}
