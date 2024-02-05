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
							key={list.id}
							name={list.name}
							setListPath={setListPath}
						/>
					))
				) : (
					<h1>You have no Lists!</h1>
				)}
				{/* 
				 	chk if data is not null and then if (!data) render nothing
					if data is recieved then 
					map over the list names in the data array and render them as list items
					render list names as links to ListItem component
				 */}
			</ul>
		</div>
	);
}
