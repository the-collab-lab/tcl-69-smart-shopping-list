import { ListItem } from '../components';

export function List({ data }) {
	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<ul>
				{data ? (
					<h1>You have no items in your list!</h1>
				) : (
					data.map((item, index) => (
						<ListItem key={index} name={item.itemName} />
					))
				)}
			</ul>
		</>
	);
}
