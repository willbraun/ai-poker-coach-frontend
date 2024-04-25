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

interface Prompt {
	index: number
	type: PromptTypes
	value: string | number | object
}

interface CardPrompt extends Prompt {
	type: 'cards'
	value: {
		round: number
		player: number
		cards: FormCard[]
		evaluation: string
	}
}

interface FormCard {
	value: string
	suit: string
}

interface ActionPrompt extends Prompt {
	type: 'action'
	value: {
		round: number
		player: number
		decision: number
		bet: number
	}
}
