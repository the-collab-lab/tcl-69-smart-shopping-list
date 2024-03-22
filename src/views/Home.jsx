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
					<h2>Welcome to Box Makers!</h2>
					<img
						className="checkbox"
						src="img/checkbox.png"
						alt="black checkbox with green check"
					/>
					<h3>
						New to the app? Click <Link to="/about">here</Link> to learn more!
					</h3>
					{!!user ? (
						<div>
							<span>Signed in as {auth.currentUser.displayName}</span> (
							<SignOutButton />)
						</div>
					) : (
						<SignInButton />
					)}
				</header>
			</div>
		</>
	);
}
