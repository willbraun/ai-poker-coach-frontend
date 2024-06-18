import { NextApiRequest, NextApiResponse } from 'next'
import * as PokerEvaluator from 'poker-evaluator-ts'
import { valueToDisplay } from '@/lib/utils'
import { FormCardValue, FormCardSuit, PokerEvaluatorCard } from '@/app/(main)/new-hand/formSchema'

const keys = Object.keys(valueToDisplay) as FormCardValue[]

const getValue = (card: PokerEvaluatorCard) => card.charAt(0) as FormCardValue
const getValues = (cards: PokerEvaluatorCard[]) => cards.map(getValue)

const cardStrengthsDesc = (values: FormCardValue[]) => {
	return values.map(value => keys.indexOf(value)).toSorted((a, b) => b - a)
}

const getHighCard = (cards: PokerEvaluatorCard[]) => {
	const values = getValues(cards)
	const highIndex = cardStrengthsDesc(values)[0]
	return keys[highIndex]
}

const getStraight = (cards: PokerEvaluatorCard[]): [FormCardValue, FormCardValue] | undefined => {
	const uniqueCards = new Set(getValues(cards))
	const cardStrengths = cardStrengthsDesc(Array.from(uniqueCards))

	let index = 0
	for (const cardStrength of cardStrengths) {
		const possibleStraight = cardStrengths.slice(index, index + 5)
		if (possibleStraight.length === 5 && possibleStraight.every((strength, i) => cardStrength - i === strength)) {
			const highCard = keys[cardStrength]
			const lowCard = keys[cardStrengths[index + 4]]
			return [lowCard, highCard]
		}
		index++
	}
}

const formatPlural = (value: FormCardValue) => {
	return value === '6' ? 'es' : 's'
}

const getDisplay = (value: FormCardValue, plural: boolean) => {
	if (!value) return 'unknown'

	const singular = valueToDisplay[value]
	const suffix = plural ? formatPlural(value) : ''
	return singular + suffix
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const cards: PokerEvaluatorCard[] = req.body.cards

	if (new Set(cards).size !== cards.length) {
		res.status(200).json({
			result: {
				handName: 'Invalid Hand: Duplicate Cards',
				value: 0,
			},
			error: '',
		})

		return
	}

	let newHandName = ''

	if (cards.length === 2) {
		if (getValue(cards[0]) === getValue(cards[1])) {
			const value = getValue(cards[0])
			newHandName = `Pocket ${getDisplay(value, true)}`
		} else {
			const highCard = getHighCard(cards)
			newHandName = `High Card: ${getDisplay(highCard, false)}`
		}

		res.status(200).json({
			result: {
				handName: newHandName,
				value: 0,
			},
			error: '',
		})

		return
	}

	const suitMap = new Map<FormCardSuit, number>()
	const valueMap = new Map<FormCardValue, number>()

	cards.forEach(card => {
		const value = card.charAt(0) as FormCardValue
		const suit = card.charAt(1) as FormCardSuit

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
				newHandName = `High Card: ${getDisplay(highCard, false)}`
				break
			case 'one pair':
				const pairValue = getValues(cards).find(value => valueMap.get(value) === 2)
				if (!pairValue) {
					newHandName = 'Error processing pair'
					break
				}
				newHandName = `Pair of ${getDisplay(pairValue, true)}`
				break
			case 'two pairs':
				const pairValues = new Set(getValues(cards).filter(value => valueMap.get(value) === 2))
				const cardStrengths = cardStrengthsDesc(Array.from(pairValues))
				const [highPair, secondPair] = cardStrengths.map(strength => keys[strength])
				newHandName = `Two Pair: ${getDisplay(highPair, true)} and ${getDisplay(secondPair, true)}`
				break
			case 'three of a kind':
				const tripValue = getValues(cards).find(value => valueMap.get(value) === 3)
				if (!tripValue) {
					newHandName = 'Error processing three of a kind'
					break
				}
				newHandName = `Three of a Kind: ${getDisplay(tripValue, true)}`
				break
			case 'straight':
				const straight = getStraight(cards)
				if (!straight) {
					newHandName = 'Error processing straight'
					break
				}
				const [straightLowCard, straightHighCard] = straight
				newHandName = `Straight: ${getDisplay(straightLowCard, false)} to ${getDisplay(straightHighCard, false)}`
				break
			case 'flush':
				const flushHighCard = getHighCard(cards)
				newHandName = `Flush: ${getDisplay(flushHighCard, false)} high`
				break
			case 'full house':
				const fhTripValue = getValues(cards).find(value => valueMap.get(value) === 3)
				const fhPairValue = getValues(cards).find(value => valueMap.get(value) === 2)
				if (!fhTripValue || !fhPairValue) {
					newHandName = 'Error processing full house'
					break
				}
				newHandName = `Full House: ${getDisplay(fhTripValue, true)} full of ${getDisplay(fhPairValue, true)}`
				break
			case 'four of a kind':
				const quadValue = getValues(cards).find(value => valueMap.get(value) === 4)
				if (!quadValue) {
					newHandName = 'Error processing four of a kind'
					break
				}
				newHandName = `Four of a Kind: ${getDisplay(quadValue, true)}`
				break
			case 'straight flush':
				const straightFlush = getStraight(cards)
				if (!straightFlush) {
					newHandName = 'Error processing straight flush'
					break
				}
				const [sfLowCard, sfHighCard] = straightFlush
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
				value: result.value,
			},
			error: '',
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			result: {
				handName: '',
				value: 0,
			},
			error: 'Error evaluating hand',
		})
	}
}
