import { suitToDisplay, valueToDisplay } from '@/lib/utils'
import { ZodIssueCode, z } from 'zod'

const atMostTwoDigitsAfterDecimal = (value: number) => {
	const stringValue = value.toString()
	const decimalIndex = stringValue.indexOf('.')

	if (decimalIndex === -1) {
		return true
	}

	const digitsAfterDecimal = stringValue.substring(decimalIndex + 1)

	return digitsAfterDecimal.length <= 2
}

const getDuplicateCards = (schema: Schema) => {
	const allCards: FormCard[] = [
		...schema.rounds.flatMap(round => round.cards.cards),
		...schema.villains.flatMap(villain => villain.cards),
	]

	const cardStrings = allCards.map(card => `${card.value}${card.suit}`)
	const uniqueCardStrings = new Set(cardStrings)
	return cardStrings.filter(card => !uniqueCardStrings.delete(card))
}

const zodNumber = z.coerce
	.number()
	.gte(0)
	.refine(atMostTwoDigitsAfterDecimal, { message: 'Cannot have more than 2 digits after the decimal' })

const zodCardValue = z.enum(['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'])
const zodCardSuit = z.enum(['C', 'D', 'H', 'S'])
const zodCard = z.object({
	value: zodCardValue,
	suit: zodCardSuit,
})

const zodCardGroup = z.object({
	player: z.number().gte(0).lte(12),
	cards: z.array(zodCard),
	evaluation: z.string(),
	value: z.number(),
})

const zodAction = z.object({
	player: z.number().gte(0).lte(12),
	decision: z.enum(['', 'fold', 'check', 'call', 'bet', 'raise', 'callAllIn', 'betAllIn']),
	bet: zodNumber,
})

const zodPotAction = z.object({
	potIndex: z.number().gte(0),
	player: z.number().gte(0).lte(12),
	bet: zodNumber,
})

const zodPot = z.object({
	potIndex: z.number().gte(0),
	value: zodNumber,
	winner: z.string(),
})

const zodRound = z.object({
	cards: zodCardGroup,
	actions: z.array(zodAction),
	potActions: z.array(zodPotAction),
	finalPots: z.array(zodPot),
})

const RawSchema = z.object({
	name: z.string(),
	gameStyle: z.coerce.number().gte(0).lte(1),
	playerCount: z.coerce.number().gte(2).lte(12),
	position: z.coerce.number().gte(1).lte(12),
	smallBlind: zodNumber,
	bigBlind: zodNumber,
	ante: zodNumber,
	bigBlindAnte: zodNumber,
	myStack: zodNumber,
	notes: z.string().optional(),
	pots: z.array(zodPot),
	rounds: z.array(zodRound),
	villains: z.array(zodCardGroup),
})

export const FormSchema = RawSchema.superRefine((data, ctx) => {
	const duplciates = getDuplicateCards(data)
	if (duplciates.length > 0) {
		const message = `Duplicate cards found: ${Array.from(duplciates)
			.map(card => {
				const value = card[0] as FormCardValue
				const suit = card[1] as FormCardSuit
				return `${valueToDisplay[value]} of ${suitToDisplay[suit]}`
			})
			.join(', ')}`

		ctx.addIssue({
			code: ZodIssueCode.custom,
			message,
		})
	}
})

export type FormCardValue = z.infer<typeof zodCardValue>
export type FormCardSuit = z.infer<typeof zodCardSuit>
export type FormCard = z.infer<typeof zodCard>
export type FormCardGroup = z.infer<typeof zodCardGroup>
export type FormAction = z.infer<typeof zodAction>
export type FormPotAction = z.infer<typeof zodPotAction>
export type FormPot = z.infer<typeof zodPot>
export type FormRound = z.infer<typeof zodRound>
export type Schema = z.infer<typeof RawSchema>
export type PokerEvaluatorCard = `${FormCardValue}${FormCardSuit}`
