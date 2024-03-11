import {
	arrayUnion,
	addDoc,
	getDoc,
	getDocs,
	setDoc,
	collection,
	doc,
	onSnapshot,
	updateDoc,
	increment,
} from 'firebase/firestore';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { useEffect, useState } from 'react';
import { db } from './config';
import { getFutureDate, getDaysBetweenDates } from '../utils';

/**
 * A custom hook that subscribes to the user's shopping lists in our Firestore
 * database and returns new data whenever the lists change.
 * @param {string | null} userId
 * @param {string | null} userEmail
 * @returns
 */
export function useShoppingLists(userId, userEmail) {
	// Start with an empty array for our data.
	const initialState = [];
	const [data, setData] = useState(initialState);

	useEffect(() => {
		// If we don't have a userId or userEmail (the user isn't signed in),
		// we can't get the user's lists.
		if (!userId || !userEmail) return;

		// When we get a userEmail, we use it to subscribe to real-time updates
		const userDocRef = doc(db, 'users', userEmail);

		onSnapshot(userDocRef, (docSnap) => {
			if (docSnap.exists()) {
				const listRefs = docSnap.data().sharedLists;
				const newData = listRefs.map((listRef) => {
					// We keep the list's id and path so we can use them later.
					return { name: listRef.id, path: listRef.path };
				});
				setData(newData);
			}
		});
	}, [userId, userEmail]);

	return data;
}

/**
 * A custom hook that subscribes to a shopping list in our Firestore database
 * and returns new data whenever the list changes.
 * @param {string | null} listPath
 * @see https://firebase.google.com/docs/firestore/query-data/listen
 */
export function useShoppingListData(listPath) {
	// Start with an empty array for our data.
	/** @type {import('firebase/firestore').DocumentData[]} */
	const initialState = [];
	const [data, setData] = useState(initialState);

	useEffect(() => {
		if (!listPath) return;

		// When we get a listPath, we use it to subscribe to real-time updates
		// from Firestore.
		return onSnapshot(collection(db, listPath, 'items'), (snapshot) => {
			// The snapshot is a real-time update. We iterate over the documents in it
			// to get the data.
			const nextData = snapshot.docs.map((docSnapshot) => {
				// Extract the document's data from the snapshot.
				const item = docSnapshot.data();

				// The document's id is not in the data,
				// but it is very useful, so we add it to the data ourselves.
				item.id = docSnapshot.id;

				return item;
			});

			// Update our React state with the new data.
			setData(nextData);
		});
	}, [listPath]);

	// Return the data so it can be used by our React components.
	return data;
}

/**
 * Add a new user to the users collection in Firestore.
 * @param {Object} user The user object from Firebase Auth.
 */
export async function addUserToDatabase(user) {
	// Check if the user already exists in the database.
	const userDoc = await getDoc(doc(db, 'users', user.email));
	// If the user already exists, we don't need to do anything.
	if (userDoc.exists()) {
		return;
	} else {
		// If the user doesn't exist, add them to the database.
		// We'll use the user's email as the document id
		// because it's more likely that the user will know their email
		// than their uid.
		await setDoc(doc(db, 'users', user.email), {
			email: user.email,
			name: user.displayName,
			uid: user.uid,
		});
	}
}

/**
 * Create a new list and add it to a user's lists in Firestore.
 * @param {string} userId The id of the user who owns the list.
 * @param {string} userEmail The email of the user who owns the list.
 * @param {string} listName The name of the new list.
 */
export async function createList(userId, userEmail, listName) {
	const listDocRef = doc(db, userId, listName);

	await setDoc(listDocRef, {
		owner: userId,
	});

	const userDocumentRef = doc(db, 'users', userEmail);

	updateDoc(userDocumentRef, {
		sharedLists: arrayUnion(listDocRef),
	});

	return listDocRef.path;
}

/**
 * Shares a list with another user.
 * @param {string} listPath The path to the list to share.
 * @param {string} recipientEmail The email of the user to share the list with.
 */
export async function shareList(listPath, currentUserId, recipientEmail) {
	// Check if current user is owner.
	if (!listPath.includes(currentUserId)) {
		return 'You are not the owner of this list, you cannot share this list.';
	}
	// Get the document for the recipient user.
	const usersCollectionRef = collection(db, 'users');
	const recipientDoc = await getDoc(doc(usersCollectionRef, recipientEmail));
	// If the recipient user doesn't exist, we can't share the list.
	if (!recipientDoc.exists()) {
		return 'The user you are trying to invite does not exist.';
	}

	// Check if list has already been shared with invited user
	const userDocumentRef = doc(db, 'users', recipientEmail);
	const userDoc = await getDoc(userDocumentRef);
	if (userDoc.exists()) {
		const userData = userDoc.data();
		if (
			userData.sharedLists &&
			userData.sharedLists.some((ref) => ref.path === listPath)
		) {
			return 'This user has already been invited to the current list.';
		}
	}

	// Add the list to the recipient user's sharedLists array.
	const listDocumentRef = doc(db, listPath);
	await updateDoc(userDocumentRef, {
		sharedLists: arrayUnion(listDocumentRef),
	});

	// check that shared list appears in the invited user's lists
	const userDocAfterUpdate = await getDoc(userDocumentRef);
	if (userDocAfterUpdate.exists()) {
		const userDataAfterUpdate = userDocAfterUpdate.data();
		if (
			userDataAfterUpdate.sharedLists &&
			userDataAfterUpdate.sharedLists.some((ref) => ref.path === listPath)
		) {
			return 'List successfully shared';
		}
	}

	return 'Failed to share list';
}

/**
 * Add a new item to the user's list in Firestore.
 * @param {string} listPath The path of the list we're adding to.
 * @param {Object} itemData Information about the new item.
 * @param {string} itemData.itemName The name of the item.
 * @param {number} itemData.daysUntilNextPurchase The number of days until the user thinks they'll need to buy the item again.
 */
export async function addItem(listPath, { itemName, daysUntilNextPurchase }) {
	if (itemName.trim() === '') {
		return { success: false, error: 'Item cannot be empty.' };
	}

	const listCollectionRef = collection(db, listPath, 'items');
	const itemsSnapshot = await getDocs(listCollectionRef);

	const itemExistsResult = itemExists(itemName, itemsSnapshot);

	if (itemExistsResult) {
		return { success: false, error: 'This item already exists in the list.' };
	}

	try {
		const newDoc = await addDoc(listCollectionRef, {
			dateCreated: new Date(),
			// NOTE: This is null because the item has just been created.
			// We'll use updateItem to put a Date here when the item is purchased!
			dateLastPurchased: null,
			dateNextPurchased: getFutureDate(daysUntilNextPurchase),
			name: itemName,
			totalPurchases: 0,
		});

		return { success: true, newDoc };
	} catch (err) {
		console.error('Error adding new item:', err);
		return { success: false };
	}
}

/*
 * Helper function for checking if a particular item
 * already exists inside of user's current list
 */
function itemExists(itemName, itemsSnapshot) {
	// function to remove whitespace and non-word chars from str
	const normalizeString = (str) =>
		str ? str.replace(/[^\w]/g, '').toLowerCase() : '';

	// create unformatted, "normalized" version of itemName
	const unformattedItemName = normalizeString(itemName);

	// loop through existing items in itemsSnapshot,
	// applying normalizeString to each item and checking
	// if it matches the unformattedItemName
	const result = itemsSnapshot.docs.some((doc) => {
		const unformattedDocItemName = normalizeString(
			doc.data() ? doc.data().name : '',
		);

		return unformattedItemName === unformattedDocItemName;
	});

	return result;
}

export async function updateItem(
	listPath,
	itemId,
	dateLastPurchased,
	totalPurchases,
	dateNextPurchased,
	dateCreated,
) {
	const dateNextPurchasedJS = dateNextPurchased.toDate();
	const dateLastPurchasedJS = dateLastPurchased?.toDate();
	const dateCreatedJS = dateCreated.toDate();

	const docRef = doc(db, listPath, 'items', itemId);
	const lastPurchaseDate = dateLastPurchased
		? dateLastPurchasedJS
		: dateCreatedJS;
	const daysSinceLastPurchase = getDaysBetweenDates(
		new Date(),
		lastPurchaseDate,
	);

	const previousEstimate = dateLastPurchased
		? getDaysBetweenDates(dateNextPurchasedJS, dateLastPurchasedJS)
		: getDaysBetweenDates(dateNextPurchasedJS, dateCreatedJS);

	const daysUntilNextPurchase = calculateEstimate(
		previousEstimate,
		daysSinceLastPurchase,
		totalPurchases,
	);

	try {
		await updateDoc(docRef, {
			totalPurchases: increment(1),
			dateLastPurchased: new Date(),
			dateNextPurchased: getFutureDate(daysUntilNextPurchase),
		});
		return { success: true };
	} catch (e) {
		console.error('Error updating item. ', e);
		return { success: false };
	}
}

export async function deleteItem() {
	/**
	 * TODO: Fill this out so that it uses the correct Firestore function
	 * to delete an existing item. You'll need to figure out what arguments
	 * this function must accept!
	 */
}
