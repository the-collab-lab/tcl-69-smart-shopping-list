import { comparePurchaseUrgency } from '../api';

export function filteredData(data, searchString) {
	return data.filter((d) =>
		d.name?.toLowerCase().includes(searchString.toLowerCase()),
	);
}

export function getSortedItems(filteredDataResult) {
	return comparePurchaseUrgency(filteredDataResult);
}

export function getGroupedItems(sortedDataResult) {
	const overdue = [];
	const buySoon = [];
	const buyKindOfSoon = [];
	const buyNotSoon = [];
	const inactive = [];

	sortedDataResult.forEach((item) => {
		if (item.isOverdue) {
			overdue.push(item);
		} else if (item.daysSinceLastPurchase >= 60) {
			inactive.push(item);
		} else if (item.daysUntilNextPurchase <= 7) {
			buySoon.push(item);
		} else if (
			item.daysUntilNextPurchase > 7 &&
			item.daysUntilNextPurchase < 15
		) {
			buyKindOfSoon.push(item);
		} else if (item.daysUntilNextPurchase >= 15) {
			buyNotSoon.push(item);
		}
	});

	return { overdue, buySoon, buyKindOfSoon, buyNotSoon, inactive };
}
