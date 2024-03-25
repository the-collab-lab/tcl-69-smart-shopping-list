import React from 'react';

function ShareEmailInput({ setRecipientEmail }) {
	function handleInviteChange(e) {
		const { value } = e.target;
		setRecipientEmail(value.toLowerCase());
	}

	return (
		<>
			<br />
			<label htmlFor="invite-to-list">
				Enter email:
				<input
					type="email"
					id="invite-to-list"
					name="inviteToList"
					onChange={handleInviteChange}
				/>
			</label>
		</>
	);
}

export default ShareEmailInput;
