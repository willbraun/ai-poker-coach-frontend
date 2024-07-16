'use client'

import { FC } from 'react'
import { TypeAnimation } from 'react-type-animation'

const TypingAnimation: FC = () => {
	return (
		<TypeAnimation
			sequence={[
				'"Betting 100 with a hand like 10-9 offsuit, out of position, is generally considered too loose in a cash game where stacks are deep. Consider folding these marginal hands from early positions to avoid being in a tough spot postflop."',
				1000,
				'"When facing the 3bet from your opponent to 200 chips, calling can be okay since Ace Jack offsuit is a decent but not premium hand."',
				1000,
				'"The key points are to tighten your preflop range from early positions, consider larger bet sizes postflop to extract more value from your opponents, and be more aggressive with strong hands to maximize your winnings."',
				1000,
				'"By betting on the river, you could have potentially gotten value from the opponent\'s hand, maximizing your winnings in this situation.',
				1000,
			]}
			speed={65}
			deletionSpeed={85}
			style={{ fontSize: '2rem' }}
			repeat={Infinity}
		/>
	)
}

export default TypingAnimation
