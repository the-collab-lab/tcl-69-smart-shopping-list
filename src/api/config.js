import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAhS4yoczdEYyjq8WhraEfosTMFkehyJss',
	authDomain: 'tcl-69-smart-shopping-list.firebaseapp.com',
	projectId: 'tcl-69-smart-shopping-list',
	storageBucket: 'tcl-69-smart-shopping-list.appspot.com',
	messagingSenderId: '93256089883',
	appId: '1:93256089883:web:f0898fe2f83bc6077513be',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
