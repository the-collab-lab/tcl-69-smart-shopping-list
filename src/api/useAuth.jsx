import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './config.js';
import { addUserToDatabase } from './firebase.js';
import './useAuth.css';

/**
 * A button that signs the user in using Google OAuth. When clicked,
 * the button redirects the user to the Google OAuth sign-in page.
 * After the user signs in, they are redirected back to the app.
 */
export const SignInButton = ({ largeSize }) => {
	let navigate = useNavigate();

	const handleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			console.log('User signed in:', user);
			navigate('/list');
		} catch (e) {
			console.error('Error signing in:', e);
		}
	};

	return (
		<button type="button" onClick={handleSignIn} className={largeSize ? 'large-size' : ''}>
			Sign In
		</button>
	);
};

/**
 * A button that signs the user out of the app using Firebase Auth.
 */
async function handleSignOut() {
	await auth.signOut();
	try {
		localStorage.clear();
		console.log('User signed out');
		window.location.href = '/';
	} catch (e) {
		console.error('Error signing out:', e);
	}
}

export const SignOutButton = ({ largeSize }) => (
	<button
		type="button"
		onClick={() => handleSignOut()}
		className={largeSize ? 'large-size' : ''}
	>
		Sign Out
	</button>
);

/**
 * A custom hook that listens for changes to the user's auth state.
 * Check out the Firebase docs for more info on auth listeners:
 * @see https://firebase.google.com/docs/auth/web/start#set_an_authentication_state_observer_and_get_user_data
 */
export const useAuth = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			setUser(user);
			if (user) {
				addUserToDatabase(user);
			}
		});
	}, []);

	return { user };
};
