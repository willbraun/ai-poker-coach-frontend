type PromptTypes =
	| 'name'
	| 'gameStyle'
	| 'playerCount'
	| 'position'
	| 'smallBlind'
	| 'bigBlind'
	| 'ante'
	| 'bigBlindAnte'
	| 'myStack'
	| 'notes'
	| 'cards'
	| 'action'

interface BasePrompt {
	type: PromptTypes
	value: string | number | CardPromptValue | ActionPromptValue
}

interface NamePrompt extends BasePrompt {
	type: 'name'
	value: string
}

interface GameStylePrompt extends BasePrompt {
	type: 'gameStyle'
	value: 0 | 1
}

interface PlayerCountPrompt extends BasePrompt {
	type: 'playerCount'
	value: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

interface PositionPrompt extends BasePrompt {
	type: 'position'
	value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

interface SmallBlindPrompt extends BasePrompt {
	type: 'smallBlind'
	value: number
}

interface BigBlindPrompt extends BasePrompt {
	type: 'bigBlind'
	value: number
}

interface AntePrompt extends BasePrompt {
	type: 'ante'
	value: number
}

interface BigBlindAntePrompt extends BasePrompt {
	type: 'bigBlindAnte'
	value: number
}

interface MyStackPrompt extends BasePrompt {
	type: 'myStack'
	value: number
}

interface NotesPrompt extends BasePrompt {
	type: 'notes'
	value: string
}

interface CardPrompt extends BasePrompt {
	type: 'cards'
	value: CardPromptValue
}

interface CardPromptValue {
	round: number
	player: number
	cards: FormCard[]
	evaluation: string
}

interface FormCard {
	value: string
	suit: string
}

interface ActionPrompt extends BasePrompt {
	type: 'action'
	value: ActionPromptValue
}

interface ActionPromptValue {
	round: number
	player: number
	decision: number
	bet: number
}

type Prompt =
	| NamePrompt
	| GameStylePrompt
	| PlayerCountPrompt
	| PositionPrompt
	| SmallBlindPrompt
	| BigBlindPrompt
	| AntePrompt
	| BigBlindAntePrompt
	| MyStackPrompt
	| NotesPrompt
