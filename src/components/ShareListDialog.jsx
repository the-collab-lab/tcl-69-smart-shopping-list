import React, { useEffect, useRef } from 'react';
import './ShareListDialog.css';

const NO_OP = () => {};

const DEFAULT_CLASSNAMES = {
	content: 'Dialog--content',
	form: 'Dialog--container',
	root: 'Dialog',
};

/**
 * @param {Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'className'> & {classNames: Partial<typeof DEFAULT_CLASSNAMES>}} props
 */
export function ShareListDialog({
	children,
	classNames,
	open = false,
	onCancel = NO_OP,
	onSubmit = NO_OP,
}) {
	// Merge the default classNames with the user-provided ones.
	classNames = React.useMemo(
		() => ({ ...DEFAULT_CLASSNAMES, ...classNames }),
		[classNames],
	);

	const ref = useRef(/** @type {?HTMLDialogElement} */ (null));

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
	 * Allow the dialog to be closed by pressing the Escape key.
	 * @param {KeyboardEvent} evt
	 */
	function handleKeydownCapture(evt) {
		if (evt.key === 'Escape') {
			ref.current.close();
			onCancel.call(ref.current, evt);
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
			className={classNames.root}
			ref={ref}
			onCancel={onCancel}
			onClickCapture={handleBackdropClick}
			onKeyDownCapture={handleKeydownCapture}
		>
			<form method="dialog" className={classNames.form} onSubmit={onSubmit}>
				<div className={classNames.content}>{children}</div>
			</form>
		</dialog>
	);
}
