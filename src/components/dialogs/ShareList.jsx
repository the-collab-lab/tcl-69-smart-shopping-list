import React from 'react';

export function ShareList({ handleInviteChange }) {
	return (
		<>
			<h2>Who are you sharing this list with?</h2>
			<div className="List-share-email-dialog-container">
				<label htmlFor="invite-to-list">
					Enter email:
					<input
						type="email"
						id="invite-to-list"
						name="inviteToList"
						onChange={handleInviteChange}
					/>
				</label>
			</div>
		</>
	);
}
