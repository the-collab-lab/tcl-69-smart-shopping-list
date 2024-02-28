import './ListItem.css';
import { updateItem } from '../api';
import { useState, useEffect } from 'react';

export function ListItem({ name }) {
	return <li className="ListItem">{name}</li>;
}
