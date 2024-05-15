import { NextApiRequest, NextApiResponse } from 'next'
import * as PokerEvaluator from 'poker-evaluator-ts'
import { valueToDisplay } from '@/lib/utils'

const getHighCard = (cards: string[]) => {
	const keys = Object.keys(valueToDisplay)
	const highIndex = cards.map(card => keys.indexOf(card.charAt(0))).toSorted((a, b) => b - a)[0]
	return keys[highIndex]
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// cards is an array of strings, e.g. ['As', 'Ks']
	const cards: string[] = req.body.cards

	if (cards.length === 2) {
		const char = cards[0].charAt(0)
		if (cards[0].charAt(0) === cards[1].charAt(0)) {
			res.status(200).json({
				result: {
					handName: `Pocket ${valueToDisplay[char]}s`,
				},
			})
		} else {
			const highCard = getHighCard(cards)

			res.status(200).json({
				result: {
					handName: `High Card ${valueToDisplay[highCard]}`,
				},
			})
		}
		return
	}

	const suitMap = new Map<string, number>()
	const valueMap = new Map<string, number>()

	cards.forEach(card => {
		const value = card.charAt(0)
		const suit = card.charAt(1)

		if (valueMap.has(value)) {
			valueMap.set(value, (valueMap.get(value) ?? 0) + 1)
		} else {
			valueMap.set(value, 1)
		}

		if (suitMap.has(suit)) {
			suitMap.set(suit, (suitMap.get(suit) ?? 0) + 1)
		} else {
			suitMap.set(suit, 1)
		}
	})

	try {
		const result = PokerEvaluator.evalHand(cards)
		const handName = result.handName
		let newHandName = ''
		switch (handName) {
			case 'high card':
				const highCard = getHighCard(cards)
				newHandName = `High Card ${valueToDisplay[highCard]}`
				break
			case 'one pair':
				const pairValue = cards.find(card => valueMap.get(card.charAt(0)) === 2)?.charAt(0)
				const displayValue = valueToDisplay[pairValue ?? ''] ?? 'unknown'
				newHandName = `Pair of ${displayValue}s`
				break
			case 'two pairs':
				const pairValues = cards.map(value => value.charAt(0)).filter(value => valueMap.get(value) === 2)
				const highPair = getHighCard(pairValues)
				const lowPair = pairValues.find(value => value !== highPair) ?? 'unknown'
				newHandName = `Two Pair: ${valueToDisplay[highPair]}s and ${valueToDisplay[lowPair]}s`
				break
			// case 'Three of a Kind':
			// 	newHandName = `Three of a Kind: ${valueToDisplay[result.cards[0].charAt(0)]}s`
			// 	break
			// case 'Straight':
			// 	newHandName = `Straight to the ${valueToDisplay[result.cards[0].charAt(0)]}`
			// 	break
			// case 'Flush':
			// 	newHandName = `Flush: ${valueToDisplay[result.cards[0].charAt(1)]}`
			// 	break
			// case 'Full House':
			// 	newHandName = `Full House: ${valueToDisplay[result.cards[0].charAt(0)]}s full of ${
			// 		valueToDisplay[result.cards[3].charAt(0)]
			// 	}s`
			// 	break
			// case 'Four of a Kind':
			// 	newHandName = `Four of a Kind: ${valueToDisplay[result.cards[0].charAt(0)]}s`
			// 	break
			// case 'Straight Flush':
			// 	newHandName = `Straight Flush to the ${valueToDisplay[result.cards[0].charAt(0)]}`
			// 	break
			// case 'Royal Flush':
			// 	newHandName = 'Royal Flush'
			// 	break
			default:
				break
		}

		res.status(200).json({ result: { handName: newHandName } })
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Error evaluating hand' })
	}
}
