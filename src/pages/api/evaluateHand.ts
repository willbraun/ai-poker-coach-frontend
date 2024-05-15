import { NextApiRequest, NextApiResponse } from 'next'
import * as PokerEvaluator from 'poker-evaluator-ts'
import { valueToDisplay } from '@/lib/utils'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// cards is an array of strings, e.g. ['As', 'Ks']
	const cards = req.body.cards as string[]

	if (cards.length === 2) {
		const char = cards[0].charAt(0)
		if (cards[0].charAt(0) === cards[1].charAt(0)) {
			res.status(200).json({
				result: {
					handName: `Pocket ${valueToDisplay[char]}s`,
				},
			})
		} else {
			const keys = Object.keys(valueToDisplay)
			const highIndex = cards.map(card => keys.indexOf(card.charAt(0))).toSorted((a, b) => b - a)[0]

			res.status(200).json({
				result: {
					handName: `High Card ${valueToDisplay[keys[highIndex]]}`,
				},
			})
		}
		return
	}

	try {
		const result = PokerEvaluator.evalHand(cards)
		res.status(200).json({ result })
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Error evaluating hand' })
	}
}
