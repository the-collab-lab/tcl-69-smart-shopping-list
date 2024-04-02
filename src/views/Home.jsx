import './Home.css';
import { useAuth, SignInButton, SignOutButton } from '../api/useAuth.jsx';
import { auth } from '../api/config.js';
import { Link } from 'react-router-dom';

export function Home() {
	const { user } = useAuth();
	return (
		<>
			<div className="Home">
				<header className="Home-header">
					<h2>Welcome to Aisle Be There!</h2>
					<h3 className="intro-text">
						The app for making smart shopping lists. Create lists to manage any
						type of shopping, and mark items by how soon you'll need them again.
					</h3>
					<img
						className="Landing-check"
						src="img/checkbox.png"
						alt="black checkbox with green check"
					/>
					<h3>
						New to the app? Click <Link to="/about">here</Link> to learn more!
					</h3>
					{!!user ? (
						<div>
							<span>Welcome back {auth.currentUser.displayName}!</span>
							<img
								src={auth.currentUser.photoURL}
								alt="profile"
								className="Home-profile-img"
							/>
							(
							<SignOutButton />)
							<br />
							<span>
								View your lists <Link to="/list">here</Link>
							</span>
						</div>
					) : (
						<div>
							<span>Click 'Sign In' to register and get started: </span>
							<SignInButton />
						</div>
					)}
				</header>
			</div>
		</>
	);
}
