import { Link } from 'react-router-dom';
import { Emoji } from '../components';
import './About.css';

export function About() {
	return (
		<>
			<main className="About-main">
				<h1 className="About-title">How It Works</h1>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Lending a list-ening ear</h2>
						<p>
							Aisle Be There to level up your organization game! Create
							specialized lists for all your kneads!{' '}
							<Emoji label="bread">🍞</Emoji>
						</p>
					</div>
				</section>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Before you go down the Aisle</h2>
						<p>
							Inside your list, tap the big 'Add' button to add a new item.
							Aisle Be There for you, asking when you might need to restock your
							aisle-ments! <Emoji label="coffee">☕</Emoji>
						</p>
					</div>
				</section>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Aisle check on you</h2>
						<p>
							As you check items off your list, you're not just staying
							organized, you're sharing your shopping habits. Aisle Be There to
							ensuring smoother, more efficient future trips!{' '}
							<Emoji label="purple-checkmark">☑️</Emoji>
						</p>
					</div>
				</section>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Aisle Be There to guide you</h2>
						<p>
							The more you use the app, the more Aisle get to know you! Aisle Be
							There to prioritize items for your next shopping trip based on
							your buying history. <Emoji label="calendar">📆</Emoji>
						</p>
					</div>
				</section>
				<section className="About-section">
					<img width="250px" alt="phone screenshot" src="../img/phone.png" />
					<div className="About-section-text">
						<h2>Aisle Be your community</h2>
						<p>
							When you share your lists, your friends and family can collaborate
							and be there for you, too! <Emoji label="purple-heart">💜</Emoji>
						</p>
					</div>
				</section>
				<section className="About-section">
					<div className="About-section-text">
						<div className="About-credits">
							<h2>Credits</h2>
							<p>
								Home page illustration by{' '}
								<Link to="https://storyset.com/web">Storyset</Link>
							</p>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
