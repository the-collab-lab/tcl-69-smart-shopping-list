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
		</div>
	);
}
