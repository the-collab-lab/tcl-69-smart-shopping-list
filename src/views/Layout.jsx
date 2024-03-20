import { Outlet, NavLink } from 'react-router-dom';
import { useAuth, SignInButton, SignOutButton } from '../api/useAuth.jsx';

import './Layout.css';
import { auth } from '../api/config.js';

export function Layout() {
	const { user } = useAuth();

	return (
		<>
			<div className="Layout">
				<header className="Layout-header">
					<h1>Smart shopping list</h1>
					{!!user ? (
						<div>
							<span>Signed in as {auth.currentUser.displayName}</span> (
							<SignOutButton />)
						</div>
					) : (
						<SignInButton />
					)}
				</header>
				<main className="Layout-main">
					<Outlet />
				</main>
				<nav className="Nav">
					<div className="Nav-container">
						<NavLink to="/" className="Nav-link">
							Home
						</NavLink>
						<NavLink to="/list" className="Nav-link">
							List
						</NavLink>
						<NavLink to="/manage-list" className="Nav-link">
							Manage List
						</NavLink>
					</div>
				</nav>
				<footer className="Layout-footer">
					<p className="Layout-footer-attribution">
						Created by{' '}
						<a
							className="Layout-footer-link"
							href="#"
							target="_blank"
							rel="noreferrer"
						>
							Amalya
						</a>
						,{' '}
						<a
							className="Layout-footer-link"
							href="#"
							rel="noreferrer"
							target="_blank"
						>
							Jessica
						</a>
						,{' '}
						<a
							className="Layout-footer-link"
							href="#"
							rel="noreferrer"
							target="_blank"
						>
							Karen
						</a>
						, &{' '}
						<a
							className="Layout-footer-link"
							href="#"
							rel="noreferrer"
							target="_blank"
						>
							Marty
						</a>{' '}
						(aka the Box Makers) in partnership with{' '}
						<a
							className="Layout-footer-link"
							href="https://the-collab-lab.codes/"
							rel="noreferrer"
							target="_blank"
						>
							The Collab Lab
						</a>
						.
					</p>
				</footer>
			</div>
		</>
	);
}
