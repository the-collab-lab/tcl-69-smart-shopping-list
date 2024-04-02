import React from 'react';
import { getSortedItems, getGroupedItems } from '../utils';
import { ListItem } from './ListItem';

export function SortedItemsMap({ filteredDataResult, listPath }) {
	const sortedDataResult = getSortedItems(filteredDataResult);

	const { overdue, buySoon, buyKindOfSoon, buyNotSoon, inactive } =
		getGroupedItems(sortedDataResult);
	return (
		<>
			<h4 className="List-section-header">Overdue</h4>
			{overdue.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
			<hr className="list-section-divider" />
			<h4 className="List-section-header">Soon</h4>
			{buySoon.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
			<hr className="list-section-divider" />
			<h4 className="List-section-header">Kind of soon</h4>
			{buyKindOfSoon.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
			<hr className="list-section-divider" />
			<h4 className="List-section-header">Not soon</h4>
			{buyNotSoon.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
			<hr className="list-section-divider" />
			<h4 className="List-section-header">Inactive</h4>
			{inactive.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
		</>
	);
}
