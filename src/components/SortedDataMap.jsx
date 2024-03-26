import React from 'react';
import { sortedData, sortedItems } from '../utils';
import { ListItem } from './ListItem';

export function SortedDataMap({ filteredDataResult, listPath }) {
	const sortedDataResult = sortedData(filteredDataResult);

	const { overdue, buySoon, buyKindOfSoon, buyNotSoon, inactive } =
		sortedItems(sortedDataResult);
	return (
		<>
			<h5>Overdue</h5>
			{overdue.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
			<h5>Soon</h5>
			{buySoon.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
			<h5>Kind of soon</h5>
			{buyKindOfSoon.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
			<h5>Not soon</h5>
			{buyNotSoon.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
			<h5>Inactive</h5>
			{inactive.map((item) => (
				<ListItem key={item.id} item={item} listPath={listPath} />
			))}
		</>
	);
}
