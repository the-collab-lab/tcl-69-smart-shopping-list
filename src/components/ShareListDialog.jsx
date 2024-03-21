import { useEffect, useRef } from 'react';
import './ShareListDialog.css';

const NO_OP = () => {};

/**
 * @param {React.DialogHTMLAttributes<HTMLDialogElement> & { onCancel: (evt: Event) => void } } props
 */
export function ShareListDialog({
	children,
	open = false,
	onCancel = NO_OP,
	// onConfirm = NO_OP,
}) {
	const ref = useRef(/** @type {HTMLDialogElement} */ (null));

	/**
	 * When the backdrop element is clicked, close the dialog
	 * and emit the 'cancel' event.
	 * @param {React.MouseEvent<HTMLDialogElement, Event>} evt
	 */
	function handleBackdropClick(evt) {
		if (evt.target === ref.current) {
			ref.current.close();
			onCancel.call(evt.target, evt);
		}
	}

	/**
	 * The <dialog> element has `showModal()` and `close()`
	 * methods that we can call when our `open` prop changes.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
	 */
	useEffect(() => {
		if (!ref.current) return;

		if (open) {
			ref.current.showModal();
		} else {
			ref.current.close();
		}
	}, [open]);

	return (
		<dialog
			className="Dialog"
			ref={ref}
			onCancel={onCancel}
			onClickCapture={handleBackdropClick}
		>
			<form
				// onSubmit={(e) => {
				// 	e.preventDefault();
				// 	onConfirm(e); // Call onConfirm function
				// }}
				method="dialog"
				className="Dialog--container"
			>
				<div className="Dialog--content">{children}</div>
			</form>
		</dialog>
	);
}
