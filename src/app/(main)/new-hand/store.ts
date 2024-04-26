import { create } from 'zustand'

interface NewHandStore {
	prompts: PromptTypes[]
	activePrompt: number
	name: string
	gameStyle: 0 | 1
	playerCount: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
	position: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
	smallBlind: 0
	bigBlind: 0
	ante: 0
	bigBlindAnte: 0
	myStack: 0
	notes: string
	round0Cards: CardPromptValue
	round0Actions: ActionPromptValue[]
	round1Cards: CardPromptValue
	round1Actions: ActionPromptValue[]
	round2Cards: CardPromptValue
	round2Actions: ActionPromptValue[]
	round3Cards: CardPromptValue
	round3Actions: ActionPromptValue[]
	villains: CardPromptValue[]
	increment: () => void
	decrement: () => void
	// pushPrompt()
	// popPrompt()
	// setName() etc.
	// setCards()
	// pushAction()
}

const initialPrompts: PromptTypes[] = [
	'name',
	'gameStyle',
	'playerCount',
	'position',
	'smallBlind',
	'bigBlind',
	'ante',
	'bigBlindAnte',
	'myStack',
	'notes',
]

export const useNewHandStore = create<NewHandStore>(set => ({
	prompts: initialPrompts,
	activePrompt: 0,
	name: '',
	gameStyle: 0,
	playerCount: 2,
	position: 1,
	smallBlind: 0,
	bigBlind: 0,
	ante: 0,
	bigBlindAnte: 0,
	myStack: 0,
	notes: '',
	round0Cards: {} as CardPromptValue,
	round0Actions: [],
	round1Cards: {} as CardPromptValue,
	round1Actions: [],
	round2Cards: {} as CardPromptValue,
	round2Actions: [],
	round3Cards: {} as CardPromptValue,
	round3Actions: [],
	villains: [],
	increment: () => set(state => ({ activePrompt: state.activePrompt + 1 })),
	decrement: () => set(state => ({ activePrompt: state.activePrompt > 0 ? state.activePrompt - 1 : 0 })),
}))
