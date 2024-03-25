import { Dialog } from '../components/Dialog';

function AlertDialog({ message, isAlertDialogOpen, setIsAlertDialogOpen }) {
	function handleConfirmClick() {
		setIsAlertDialogOpen(false);
	}

	return (
		<>
			<Dialog
				open={isAlertDialogOpen}
				onConfirm={handleConfirmClick}
				classNames={Dialog - alert}
			>
				<h2>Wait a sec!</h2>
				<p>{message}</p>
				<div className="Dialog--button-group">
					<button
						className="c-button c-button__danger"
						onClick={handleConfirmClick}
					>
						Yes
					</button>
				</div>
			</Dialog>
		</>
	);
}

export default AlertDialog;
