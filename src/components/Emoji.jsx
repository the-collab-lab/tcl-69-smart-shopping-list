export function Emoji({ children, label }) {
	return (
		<span role="img" aria-label={label}>
			{children}
		</span>
	);
}
