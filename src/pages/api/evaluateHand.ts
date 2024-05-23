import { NextApiRequest, NextApiResponse } from 'next'
import * as PokerEvaluator from 'poker-evaluator-ts'
import { valueToDisplay } from '@/lib/utils'

const keys = Object.keys(valueToDisplay)

const cardStrengthsDesc = (cards: string[]) => {
	return cards.map(card => keys.indexOf(card.charAt(0))).toSorted((a, b) => b - a)
}

const getHighCard = (cards: string[]) => {
	const highIndex = cardStrengthsDesc(cards)[0]
	return keys[highIndex]
}

const getStraight = (cards: string[]): [string, string] => {
	const cardStrengths = cardStrengthsDesc(cards)
	for (const cardStrength of cardStrengths) {
		const index = cardStrengths.indexOf(cardStrength)
		if (cardStrengths.slice(index, index + 5).every((strength, i) => cardStrength - i === strength)) {
			const highCard = keys[cardStrength]
			const lowCard = keys[cardStrengths[index + 4]]
			return [lowCard, highCard]
		}
	}
	return ['unknown', 'unknown']
}

const formatPlural = (value: string | undefined) => {
	return value === '6' ? 'es' : 's'
}

const getDisplay = (value: string | undefined, plural: boolean) => {
	const singular = valueToDisplay[value ?? ''] ?? 'unknown'
	const suffix = plural ? formatPlural(value) : ''
	return singular + suffix
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// cards is an array of strings, e.g. ['As', 'Ks']
	const cards: string[] = req.body.cards

	let newHandName = ''

	if (cards.length === 2) {
		if (cards[0] === cards[1]) {
			newHandName = 'Invalid Hand'
		} else if (cards[0].charAt(0) === cards[1].charAt(0)) {
			const value = cards[0].charAt(0)
			newHandName = `Pocket ${getDisplay(value, true)}`
		} else {
			const highCard = getHighCard(cards)
			newHandName = `High Card: ${getDisplay(highCard, false)}`
		}

		res.status(200).json({
			result: {
				handName: newHandName,
			},
		})

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
		switch (handName) {
			case 'high card':
				const highCard = getHighCard(cards)
				newHandName = `High Card: ${valueToDisplay[highCard]}`
				break
			case 'one pair':
				const pairValue = cards.find(card => valueMap.get(card.charAt(0)) === 2)?.charAt(0)
				newHandName = `Pair of ${getDisplay(pairValue, true)}`
				break
			case 'two pairs':
				const pairValues = cards.map(value => value.charAt(0)).filter(value => valueMap.get(value) === 2)
				const highPair = getHighCard(pairValues)
				const lowPair = pairValues.find(value => value !== highPair) ?? 'unknown'
				newHandName = `Two Pair: ${getDisplay(highPair, true)} and ${getDisplay(lowPair, true)}`
				break
			case 'three of a kind':
				const tripValue = cards.find(card => valueMap.get(card.charAt(0)) === 3)?.charAt(0)
				newHandName = `Three of a Kind: ${getDisplay(tripValue, true)}`
				break
			case 'straight':
				const [straightLowCard, straightHighCard] = getStraight(cards)
				newHandName = `Straight: ${getDisplay(straightLowCard, false)} to ${getDisplay(straightHighCard, false)}`
				break
			case 'flush':
				const flushHighCard = getHighCard(cards)
				newHandName = `Flush: ${getDisplay(flushHighCard, false)} high`
				break
			case 'full house':
				const fhTripValue = cards.find(card => valueMap.get(card.charAt(0)) === 3)?.charAt(0)
				const fhPairValue = cards.find(card => valueMap.get(card.charAt(0)) === 2)?.charAt(0)
				newHandName = `Full House: ${getDisplay(fhTripValue, true)} full of ${getDisplay(fhPairValue, true)}`
				break
			case 'four of a kind':
				const quadValue = cards.find(card => valueMap.get(card.charAt(0)) === 4)?.charAt(0)
				newHandName = `Four of a Kind: ${getDisplay(quadValue, true)}`
				break
			case 'straight flush':
				const [sfLowCard, sfHighCard] = getStraight(cards)
				if (sfHighCard === 'A') {
					newHandName = 'Royal Flush'
					break
				}
				newHandName = `Straight Flush: ${getDisplay(sfLowCard, false)} to ${getDisplay(sfHighCard, false)}`
				break
			case 'invalid hand':
			default:
				newHandName = 'Invalid Hand'
				break
		}

		res.status(200).json({
			result: {
				handName: newHandName,
			},
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ error: 'Error evaluating hand' })
	}
}
