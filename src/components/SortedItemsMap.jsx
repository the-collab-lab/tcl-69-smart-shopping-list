import React from 'react';
import { getSortedItems, getGroupedItems } from '../utils';
import { ListItem } from './ListItem';
import './SortedItemsMap.css';

export function SortedItemsMap({ filteredDataResult, listPath }) {
	const sortedDataResult = getSortedItems(filteredDataResult);

	const { overdue, buySoon, buyKindOfSoon, buyNotSoon, inactive } =
		getGroupedItems(sortedDataResult);
	return (
		<>
			{overdue.length > 0 && (
				<>
					<h4 className="SortedItems-section-header">Overdue</h4>
					{overdue.map((item) => (
						<ListItem key={item.id} item={item} listPath={listPath} />
					))}
					<hr className="SortedItems-section-divider" />
				</>
			)}

			{buySoon.length > 0 && (
				<>
					<h4 className="SortedItems-section-header">Soon</h4>
					{buySoon.map((item) => (
						<ListItem key={item.id} item={item} listPath={listPath} />
					))}
					<hr className="SortedItems-section-divider" />
				</>
			)}

			{buyKindOfSoon.length > 0 && (
				<>
					<h4 className="SortedItems-section-header">Kind of soon</h4>
					{buyKindOfSoon.map((item) => (
						<ListItem key={item.id} item={item} listPath={listPath} />
					))}
					<hr className="SortedItems-section-divider" />
				</>
			)}

			{buyNotSoon.length > 0 && (
				<>
					<h4 className="SortedItems-section-header">Not soon</h4>
					{buyNotSoon.map((item) => (
						<ListItem key={item.id} item={item} listPath={listPath} />
					))}
					<hr className="SortedItems-section-divider" />
				</>
			)}

			{inactive.length > 0 && (
				<>
					<h4 className="SortedItems-section-header">Inactive</h4>
					{inactive.map((item) => (
						<ListItem key={item.id} item={item} listPath={listPath} />
					))}
				</>
			)}
		</>
	);
}
