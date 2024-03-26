import React from 'react';

export function renderCancelButton(handleCancelClick) {
	return (
		<button className="c-button c-button-cancel" onClick={handleCancelClick}>
			Cancel
		</button>
	);
}

export function renderConfirmButton(handleConfirmClick) {
	return (
		<button className="c-button c-button-confirm" onClick={handleConfirmClick}>
			Confirm
		</button>
	);
}
