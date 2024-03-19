import { Link } from 'react-router-dom';
import './SingleList.css';

export function SingleList({ name, path, setListPath }) {
	function handleClick() {
		setListPath(path);
	}

	return (
		<li className="SingleList">
			<Link to="/list">
				<button onClick={handleClick}>{name}</button>
			</Link>
		</li>
	);
}
