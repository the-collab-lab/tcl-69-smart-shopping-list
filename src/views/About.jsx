import './About.css';

export function About() {
	return (
		<>
			<main className="About-main">
				<h1 className="About-title">How It Works</h1>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Make some lists</h2>
						<p>
							Level up your organization game by creating specialized lists for
							all your needs.
						</p>
					</div>
				</section>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Add some items</h2>
						<p>
							Inside your list, simply tap the big '+' button to add a new item.
							Box Makers will ask you when you might need to buy the item again.
						</p>
					</div>
				</section>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Check stuff off when you buy them</h2>
						<p>
							As you purchase items, mark them off your list. By doing so,
							you're not just staying organized, but you're also teaching Box
							Makers your shopping habits, making future trips even more
							streamlined and efficient.
						</p>
					</div>
				</section>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Box Makers predicts when you'll need the item again</h2>
						<p>
							The more you use Box Makers, the smarter it gets! Box Makers will
							help you prioritize items for your next shopping trip using your
							buying history.
						</p>
					</div>
				</section>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Share with your family and friends</h2>
						<p>
							Anyone you share a list with will be able to contribute to the
							list
						</p>
					</div>
				</section>
			</main>
		</>
	);
}
