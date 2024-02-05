import './Home.css';
import { SingleList } from '../components';

export function Home({ data, setListPath }) {
	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<ul>
				{data ? (
					<h1>You have no Lists!</h1>
				) : (
					data.map((list, index) => (
						<SingleList
							key={index}
							name={list.listName}
							setListPath={setListPath}
						/>
					))
				)}
			</ul>
		</div>
	);
}
