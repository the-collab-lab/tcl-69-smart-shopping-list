import { comparePurchaseUrgency } from '../api';

export function filteredData(data, searchString) {
	return data.filter((d) =>
		d.name?.toLowerCase().includes(searchString.toLowerCase()),
	);
}

export function sortedData(filteredData) {
	return comparePurchaseUrgency(filteredData);
}

export function sortedItems(filteredData) {
	const overdue = [];
	const buySoon = [];
	const buyKindOfSoon = [];
	const buyNotSoon = [];
	const inactive = [];

	filteredData.forEach((d) => {
		if (d.daysUntilNextPurchase <= 0) {
			overdue.push(d);
		} else if (d.daysUntilNextPurchase <= 3) {
			buySoon.push(d);
		} else if (d.daysUntilNextPurchase <= 7) {
			buyKindOfSoon.push(d);
		} else if (d.daysUntilNextPurchase <= 14) {
			buyNotSoon.push(d);
		} else {
			inactive.push(d);
		}
	});

	return { overdue, buySoon, buyKindOfSoon, buyNotSoon, inactive };
}
