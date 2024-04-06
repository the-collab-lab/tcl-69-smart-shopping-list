import { Link } from 'react-router-dom';
import { auth, useAuth, SignInButton, SignOutButton } from '../api';
import './Home.css';

export function Home() {
	const { user } = useAuth();
	return (
		<>
			<div className="Home">
				<header className="Home-header">
					<h2 className="Home-welcome-to">welcome to</h2>
					<h1 className="Home-app-name">Aisle Be There!</h1>
					<h3 className="Home-intro-text">
						The app for making smart shopping lists. Create lists to manage any
						type of shopping and mark items by how soon you'll need them again.
					</h3>
					<img
						className="Home-welcome"
						src="img/home-welcome-image.svg"
						alt="two people standing in front of a large list with a floating hand checking an item off"
					/>
					{!!user ? (
						<div>
							<h2>Welcome back</h2>
							<h2>{auth.currentUser.displayName}!</h2>
							<br />
							<Link to="/list">
								<button className="Home-button">View Lists</button>
							</Link>
							<br />
							<br />
							<br />
							<SignOutButton largeSize />
						</div>
					) : (
						<div>
							<h3>New to the app?</h3>
							<Link to="/about">
								<button className="Home-button">Learn More</button>
							</Link>
							<h3 className="Home-register-here">Register here:</h3>
							<SignInButton largeSize />
						</div>
					)}
				</header>
			</div>
		</>
	);
}
