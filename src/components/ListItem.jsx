import './ListItem.css';
import { useState, useEffect } from 'react';

export function ListItem({ name }) {
	return <li className="ListItem">{name}</li>;
}
