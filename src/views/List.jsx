import { ListItem } from '../components';

export function List({ data }) {
	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<ul>
				{data && data.length > 0 ? (
					data.map((item, id) => (
						// Removed double map to reflect current Firestore data model
						<ListItem key={id} name={item.name} />
					))
				) : (
					<h1>You have no items in your list!</h1>
				)}
			</ul>
		</>
	);
}
