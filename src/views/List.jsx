import { ListItem } from '../components';

export function List({ data }) {
	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<ul>
				{data && data.length > 0 ? (
					data.map((item) =>
						item.items.map((name, id) => <ListItem key={id} name={name} />),
					)
				) : (
					<h1>You have no items in your list!</h1>
				)}
			</ul>
		</>
	);
}
