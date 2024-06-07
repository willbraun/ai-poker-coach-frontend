import { z } from 'zod'

const atMostTwoDigitsAfterDecimal = (value: number) => {
	const stringValue = value.toString()
	const decimalIndex = stringValue.indexOf('.')

	if (decimalIndex === -1) {
		return true
	}

	const digitsAfterDecimal = stringValue.substring(decimalIndex + 1)

	return digitsAfterDecimal.length <= 2
}

const zodNumber = z.coerce
	.number()
	.gte(0)
	.refine(atMostTwoDigitsAfterDecimal, { message: 'Cannot have more than 2 digits after the decimal' })

const zodCardValue = z.enum(['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'])
const zodCardSuit = z.enum(['C', 'D', 'H', 'S'])

const zodCardGroup = z.object({
	player: z.number().gte(0).lte(12),
	cards: z.array(
		z.object({
			value: zodCardValue,
			suit: zodCardSuit,
		})
	),
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

export const FormSchema = z.object({
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

export type FormCardValue = z.infer<typeof zodCardValue>
export type FormCardSuit = z.infer<typeof zodCardSuit>
export type FormCardGroup = z.infer<typeof zodCardGroup>
export type FormPotAction = z.infer<typeof zodPotAction>
export type FormRound = z.infer<typeof zodRound>
export type Schema = z.infer<typeof FormSchema>
export type PokerEvaluatorCard = `${FormCardValue}${FormCardSuit}`
