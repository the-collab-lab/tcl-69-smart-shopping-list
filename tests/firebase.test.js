import { describe, expect } from 'vitest';
import { Timestamp } from 'firebase/firestore';

export function comparePurchaseUrgency(data) {
	const currentDate = new Date();
	const ONE_DAY_IN_MILLISECONDS = 86400000;

	const updatedData = data.map((item) => {
		// calculate time difference directly without using the absolute value built into getDaysBetweenDates function
		const daysUntilNextPurchase = Math.floor(
			(item.dateNextPurchased.toDate() - currentDate) / ONE_DAY_IN_MILLISECONDS,
		);

		const daysSinceLastPurchase = item.dateLastPurchased
			? getDaysBetweenDates(item.dateLastPurchased.toDate(), currentDate)
			: null;

		const isOverdue =
			daysUntilNextPurchase < 0 &&
			(daysSinceLastPurchase === null || daysSinceLastPurchase < 60);

		return { ...item, daysUntilNextPurchase, daysSinceLastPurchase, isOverdue };
	});

	return updatedData.sort((itemA, itemB) => {
		//prioritize overdue items
		if (itemA.isOverdue && !itemB.isOverdue) return -1;
		if (!itemA.isOverdue && itemB.isOverdue) return 1;

		//prioritize active items (items with less days since last purchase, the more active)
		if (itemA.daysSinceLastPurchase < itemB.daysSinceLastPurchase) return -1;
		if (itemA.daysSinceLastPurchase > itemB.daysSinceLastPurchase) return 1;

		//sort by days until next purchase (sooner purchases come first)
		if (itemA.daysUntilNextPurchase > itemB.daysUntilNextPurchase) return 1;
		if (itemA.daysUntilNextPurchase < itemB.daysUntilNextPurchase) return -1;

		//sort alphabetically by name for items with the same urgency
		if (itemA.name > itemB.name) return 1;
		if (itemA.name < itemB.name) return -1;

		return 0;
	});
}

describe('comparePurchaseUrgency', () => {
	it('confirms this is a funciton', () => {
		expect(typeof comparePurchaseUrgency).toBe('function');
	});
	// what is the result if I don't pass in anything at all [ empty ]
	// not a lot of real world ways of passing an empty array
	it('returns an array', () => {
		expect(comparePurchaseUrgency([])).toEqual([]);
	});
	// mock input
	it('returns in alphebetical order', () => {
		const mockData = [
			{
				name: 'Banana',
				dateNextPurchased: new Date('2023-01-20'),
				dateLastPurchased: new Date('2022-12-18'),
			},
			{
				name: 'Apple',
				dateNextPurchased: new Date('2023-01-20'),
				dateLastPurchased: new Date('2022-12-18'),
			},
		];
		const mockOutput = [
			{
				name: 'Apple',
				dateNextPurchased: new Date('2023-01-20'),
				dateLastPurchased: new Date('2022-12-18'),
			},
			{
				name: 'Banana',
				dateNextPurchased: new Date('2023-01-20'),
				dateLastPurchased: new Date('2022-12-18'),
			},
		];
		expect(comparePurchaseUrgency(mockData)).toEqual(mockOutput);
	});
});
