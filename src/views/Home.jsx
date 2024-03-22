import './Home.css';
import { useAuth, SignInButton, SignOutButton } from '../api/useAuth.jsx';
import { auth } from '../api/config.js';

export function Home() {
	const { user } = useAuth();
	return (
		<>
			<div className="Home">
				<header className="Home-header">
					<h2>Welcome to Box Makers!</h2>
					<img src="img/checkbox.png" alt="black checkbox with green check" />
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
