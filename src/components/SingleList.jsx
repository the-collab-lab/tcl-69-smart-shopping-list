import { Link } from 'react-router-dom';
import { deleteList } from '../api';
import './SingleList.css';

export function SingleList({ name, path, setListPath }) {
	function handleClick() {
		setListPath(path);
	}

	async function handleDeleteList() {
		if (
			window.confirm(
				`Are you sure you want to delete ${name} from your lists?`,
			) === true
		) {
			const result = await deleteList(path);
			if (result.success) {
				alert(`${name} has been successfully deleted.`);
			} else {
				alert(
					'An error has occurred. List not deleted. Please try again. Error: ',
					result.error,
				);
			}
		} else {
			alert('List not deleted.');
		}
	}

	return (
		<li className="SingleList">
			<Link to="/manage-list">
				<button onClick={handleClick}>{name}</button>
			</Link>
			<button
				type="button"
				id={name}
				name={name}
				onClick={handleDeleteList}
				aria-label={`delete ${name}`}
			>
				X
			</button>
		</li>
	);
}
